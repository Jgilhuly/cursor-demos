#!/bin/bash

# DBT Pipeline Runner - Shell Script Version
# Loads Snowflake credentials from .env file and executes the DBT transformation pipeline.

set -e  # Exit on any error

echo "🚀 Starting DBT Pipeline for Jaffle Shop Orders Unix Date Transformation"
echo "======================================================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Snowflake credentials."
    echo "Required variables:"
    echo "  SNOWFLAKE_ACCOUNT"
    echo "  SNOWFLAKE_USER"
    echo "  SNOWFLAKE_PASSWORD"
    echo "  SNOWFLAKE_ROLE"
    echo "  SNOWFLAKE_DATABASE"
    echo "  SNOWFLAKE_WAREHOUSE"
    echo "  SNOWFLAKE_SCHEMA"
    exit 1
fi

# Load environment variables from .env file
echo "📄 Loading environment variables from .env"
export $(grep -v '^#' .env | grep -v '^$' | xargs)

# Verify required variables are set
required_vars=("SNOWFLAKE_ACCOUNT" "SNOWFLAKE_USER" "SNOWFLAKE_PASSWORD" "SNOWFLAKE_ROLE" "SNOWFLAKE_DATABASE" "SNOWFLAKE_WAREHOUSE" "SNOWFLAKE_SCHEMA")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables: ${missing_vars[*]}"
    echo "Please check your .env file and ensure all variables are set."
    exit 1
fi

echo "✅ All required Snowflake credentials are loaded"

# Function to run DBT commands with error handling
run_dbt_command() {
    local cmd="$1"
    local description="$2"
    
    echo ""
    echo "🔄 $description"
    echo "Running: $cmd"
    
    if $cmd; then
        echo "✅ $description completed successfully"
    else
        echo "❌ $description failed!"
        echo "❓ Continue with remaining steps? (y/n)"
        read -r response
        if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
            echo "Pipeline execution stopped by user."
            exit 1
        fi
    fi
}

# Test DBT connection first
echo ""
echo "🔄 Testing DBT connection"
echo "Running: dbt debug"

if ! dbt debug; then
    echo "❌ DBT connection test failed. Cannot continue."
    echo "Please check your Snowflake credentials and network connectivity."
    exit 1
fi

echo "✅ DBT connection test completed successfully"

# Run the DBT pipeline
run_dbt_command "dbt deps" "Installing DBT dependencies"
run_dbt_command "dbt run --models staging" "Running staging models"
run_dbt_command "dbt run --models orders_with_unix_date" "Running unix date transformation"
run_dbt_command "dbt test" "Running data quality tests"

# Summary
echo ""
echo "======================================================================"
echo "📊 PIPELINE EXECUTION SUMMARY"
echo "======================================================================"
echo "🎉 Pipeline completed successfully!"
echo ""
echo "✅ Your transformed table 'orders_with_unix_date' is now available in Snowflake"
echo "✅ The table includes order_date in Unix timestamp format"
echo ""
echo "📁 Check your Snowflake database for the transformed table:"
echo "   Database: $SNOWFLAKE_DATABASE"
echo "   Schema: $SNOWFLAKE_SCHEMA"
echo "   Table: orders_with_unix_date"
echo ""
echo "❓ Would you like to generate DBT documentation? (y/n)"
read -r doc_response
if [ "$doc_response" = "y" ] || [ "$doc_response" = "Y" ]; then
    echo "🔄 Generating DBT documentation"
    dbt docs generate
    echo "📚 Documentation generated! To view it, run: dbt docs serve"
fi

echo ""
echo "🎉 All done! Happy analyzing! 📊" 