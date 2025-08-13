# Jaffle Shop Orders Unix Date Transformation

This DBT project transforms the `jaffle_shop.orders` table to include the `order_date` field in Unix timestamp format.

## Project Structure

```
├── dbt_project.yml          # DBT project configuration
├── profiles.yml             # Snowflake connection profiles
├── run_pipeline.sh          # 🚀 Executable shell script to run pipeline
├── run_dbt_pipeline.py      # 🚀 Executable Python script to run pipeline
├── models/
│   ├── staging/
│   │   ├── stg_orders.sql   # Staging model with data cleaning
│   │   └── sources.yml      # Source table definitions
│   ├── orders_with_unix_date.sql  # Main transformation model
│   └── schema.yml           # Model documentation and tests
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Fill in your Snowflake connection details

3. **Set Environment Variables**:
   ```bash
   source .env
   # or export each variable individually
   ```

## Models

### `stg_orders`
- Staging model that performs basic data cleaning on the source `jaffle_shop.orders` table
- Materialized as a view
- Handles null values and standardizes data formats

### `orders_with_unix_date`
- Main transformation model that adds Unix timestamp columns
- Materialized as a table
- Includes multiple date format variations:
  - `order_date_unix`: Unix timestamp in seconds
  - `order_date_unix_ms`: Unix timestamp in milliseconds
  - `order_date_string`: Date as YYYY-MM-DD string
  - `order_year`, `order_month`, `order_day`: Extracted date parts
  - `order_day_of_week`: Day of week (1=Sunday, 7=Saturday)

## Quick Start

### Option 1: Automated Pipeline (Recommended)
```bash
# Make sure you have your .env file configured, then run:
./run_pipeline.sh           # Shell script version
# OR
python run_dbt_pipeline.py  # Python script version
```

### Option 2: Manual DBT Commands

1. **Test Connection**:
   ```bash
   dbt debug
   ```

2. **Run Models**:
   ```bash
   # Run all models
   dbt run
   
   # Run specific model
   dbt run --models orders_with_unix_date
   
   # Run staging models only
   dbt run --models staging
   ```

3. **Run Tests**:
   ```bash
   dbt test
   ```

4. **Generate Documentation**:
   ```bash
   dbt docs generate
   dbt docs serve
   ```

## Pipeline Scripts

### `run_pipeline.sh` (Shell Script)
- ✅ Simple bash script
- ✅ Loads .env automatically
- ✅ Error handling with user prompts
- ✅ Step-by-step execution feedback

### `run_dbt_pipeline.py` (Python Script)  
- ✅ Advanced error handling
- ✅ Colored output and progress indicators
- ✅ Detailed logging
- ✅ Cross-platform compatibility

## Key Features

- **Unix Timestamp Conversion**: Converts `order_date` to Unix format using Snowflake's `DATE_PART('epoch_second', ...)` function
- **Data Quality**: Includes data quality tests and basic cleaning
- **Multiple Formats**: Provides various date format options for flexibility
- **Documentation**: Comprehensive model and column documentation
- **Modular Design**: Staging layer separates data cleaning from business logic

## Example Output

The `orders_with_unix_date` table will contain:

| order_id | customer_id | order_date | order_date_unix | status | order_year | order_month |
|----------|-------------|------------|-----------------|--------|------------|-------------|
| 1        | 100         | 2023-01-15 | 1673740800      | completed | 2023       | 1           |
| 2        | 101         | 2023-01-16 | 1673827200      | shipped   | 2023       | 1           |

## Notes

- Ensure your Snowflake user has appropriate permissions to read from the source schema and write to the target schema
- The project assumes the source table exists at `jaffle_shop.orders`
- Unix timestamps are calculated in seconds since epoch (January 1, 1970) 