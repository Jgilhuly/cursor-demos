
  create or replace   view RAW.JAFFLE_SHOP.stg_orders_debug
  
   as (
    

-- First, let's see all columns from the source table
SELECT * 
FROM RAW.jaffle_shop.orders
LIMIT 5
  );

