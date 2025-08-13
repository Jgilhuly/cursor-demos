#!/usr/bin/env python3
"""
Test script to verify dev container setup is working correctly.
Run this after setting up the dev container.
"""

import sys
import os
import psycopg2


def test_python_packages():
    """Test that required Python packages are installed."""
    print("Testing Python packages...")

    required_packages = [
        'pandas', 'numpy', 'sklearn', 'seaborn',
        'plotly', 'streamlit', 'psycopg2', 'sqlalchemy'
    ]

    for package in required_packages:
        try:
            __import__(package)
            print(f"✓ {package}")
        except ImportError:
            print(f"✗ {package} - NOT FOUND")
            return False

    return True


def test_database_connection():
    """Test PostgreSQL database connection."""
    print("\nTesting database connection...")

    try:
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST', 'postgres'),
            database=os.getenv('POSTGRES_DB', 'moviedb'),
            user=os.getenv('POSTGRES_USER', 'demo'),
            password=os.getenv('POSTGRES_PASSWORD', 'demo123')
        )
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result and result[0] == 1:
            print("✓ Database connection successful")
            return True
        else:
            print("✗ Database connection failed")
            return False

    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False


def test_sample_data():
    """Test that sample data files are accessible."""
    print("\nTesting sample data access...")

    files_to_check = [
        'sample_data/movie_logs.json',
        'sample_data/movies_features.csv',
        'sample_data/init.sql'
    ]

    all_found = True
    for file_path in files_to_check:
        if os.path.exists(file_path):
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path} - NOT FOUND")
            all_found = False

    return all_found


def main():
    """Run all tests."""
    print("=== Dev Container Setup Verification ===\n")

    tests = [
        test_python_packages,
        test_database_connection,
        test_sample_data
    ]

    results = []
    for test in tests:
        results.append(test())

    print("\n=== Results ===")
    if all(results):
        print("🎉 All tests passed! Your dev container is ready.")
        return 0
    else:
        print("❌ Some tests failed. Check the output above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
