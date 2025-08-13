{{
  config(
    materialized='view',
    description='Staging layer for jaffle_shop orders table with basic cleaning'
  )
}}

SELECT 
    id AS order_id,
    user_id AS customer_id,
    order_date,
    status,
    -- Basic data quality checks and cleaning
    CASE 
        WHEN order_date IS NULL THEN CURRENT_DATE()
        ELSE order_date
    END AS order_date_cleaned,
    
    -- Standardize status values
    UPPER(TRIM(status)) AS status_cleaned,
    
    -- Add row metadata
    CURRENT_TIMESTAMP() AS loaded_at

FROM {{ source('jaffle_shop', 'orders') }}

-- Basic data quality filters
WHERE id IS NOT NULL
  AND user_id IS NOT NULL 