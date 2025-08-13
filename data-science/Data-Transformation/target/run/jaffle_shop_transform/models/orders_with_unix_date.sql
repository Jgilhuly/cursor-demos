
  
    

create or replace transient table RAW.JAFFLE_SHOP.orders_with_unix_date
    

    
    as (

SELECT 
    order_id,
    customer_id,
    order_date,
    -- Convert order_date to unix timestamp (seconds since epoch)
    DATE_PART('epoch_second', order_date::timestamp) AS order_date_unix,
    status,
    -- Include original order_date for reference
    order_date AS order_date_original,
    -- Add some additional useful date formats
    DATE_PART('epoch_millisecond', order_date::timestamp) AS order_date_unix_ms,
    TO_CHAR(order_date, 'YYYY-MM-DD') AS order_date_string,
    EXTRACT(year FROM order_date) AS order_year,
    EXTRACT(month FROM order_date) AS order_month,
    EXTRACT(day FROM order_date) AS order_day,
    DAYOFWEEK(order_date) AS order_day_of_week,
    -- Metadata
    CURRENT_TIMESTAMP() AS transformed_at
FROM RAW.JAFFLE_SHOP.stg_orders
    )
;


  