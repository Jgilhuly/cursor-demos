
  create or replace   view RAW.JAFFLE_SHOP.column_info
  
   as (
    

-- Show first row to understand column names
SELECT *
FROM RAW.jaffle_shop.orders
LIMIT 1
  );

