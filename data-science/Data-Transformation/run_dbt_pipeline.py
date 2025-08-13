#!/usr/bin/env python3
"""
DBT Pipeline Runner
Loads Snowflake credentials from .env file and executes the DBT transformation pipeline.
"""

import os
import sys
import subprocess
from pathlib import Path

def load_env_file(env_path=".env"):
    """Load environment variables from .env file"""
    if not os.path.exists(env_path):
        print(f"❌ Error: {env_path} file not found!")
        print("Please create a .env file with your Snowflake credentials.")
        print("See .env.template for the required format.")
        sys.exit(1)
    
    print(f"📄 Loading environment variables from {env_path}")
    
    with open(env_path, 'r') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            # Skip empty lines and comments
            if not line or line.startswith('#'):
                continue
            
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")  # Remove quotes
                os.environ[key] = value
                print(f"  ✓ Set {key}")
            else:
                print(f"  ⚠️  Warning: Invalid format on line {line_num}: {line}")

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"\n🔄 {description}")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            capture_output=True, 
            text=True
        )
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print("Output:")
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed!")
        print(f"Error code: {e.returncode}")
        if e.stdout:
            print("STDOUT:")
            print(e.stdout)
        if e.stderr:
            print("STDERR:")
            print(e.stderr)
        return False

def verify_credentials():
    """Verify that required Snowflake credentials are set"""
    required_vars = [
        'SNOWFLAKE_ACCOUNT',
        'SNOWFLAKE_USER', 
        'SNOWFLAKE_PASSWORD',
        'SNOWFLAKE_ROLE',
        'SNOWFLAKE_DATABASE',
        'SNOWFLAKE_WAREHOUSE',
        'SNOWFLAKE_SCHEMA'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        print("Please check your .env file and ensure all variables are set.")
        return False
    
    print("✅ All required Snowflake credentials are set")
    return True

def main():
    """Main pipeline execution"""
    print("🚀 Starting DBT Pipeline for Jaffle Shop Orders Unix Date Transformation")
    print("=" * 70)
    
    # Load environment variables
    load_env_file()
    
    # Verify credentials
    if not verify_credentials():
        sys.exit(1)
    
    # DBT Commands to run
    commands = [
        ("dbt debug", "Testing DBT connection"),
        ("dbt deps", "Installing DBT dependencies"),
        ("dbt run --models staging", "Running staging models"),
        ("dbt run --models orders_with_unix_date", "Running unix date transformation"),
        ("dbt test", "Running data quality tests"),
    ]
    
    failed_commands = []
    
    for command, description in commands:
        if not run_command(command, description):
            failed_commands.append(description)
            
            # Ask user if they want to continue on failure
            if description == "Testing DBT connection":
                print("\n❌ DBT connection test failed. Cannot continue.")
                sys.exit(1)
            else:
                response = input(f"\n❓ {description} failed. Continue with remaining steps? (y/n): ")
                if response.lower() != 'y':
                    break
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 PIPELINE EXECUTION SUMMARY")
    print("=" * 70)
    
    if not failed_commands:
        print("🎉 All steps completed successfully!")
        print("\n✅ Your transformed table 'orders_with_unix_date' is now available in Snowflake")
        print("✅ The table includes order_date in Unix timestamp format")
        
        # Optional: Generate and serve docs
        response = input("\n❓ Would you like to generate and serve DBT documentation? (y/n): ")
        if response.lower() == 'y':
            run_command("dbt docs generate", "Generating documentation")
            print("\n📚 To view documentation, run: dbt docs serve")
            
    else:
        print(f"⚠️  Pipeline completed with {len(failed_commands)} failed step(s):")
        for cmd in failed_commands:
            print(f"  - {cmd}")
    
    print(f"\n📁 Check your Snowflake database for the transformed table:")
    print(f"   Database: {os.environ.get('SNOWFLAKE_DATABASE')}")
    print(f"   Schema: {os.environ.get('SNOWFLAKE_SCHEMA')}")
    print(f"   Table: orders_with_unix_date")

if __name__ == "__main__":
    main() 