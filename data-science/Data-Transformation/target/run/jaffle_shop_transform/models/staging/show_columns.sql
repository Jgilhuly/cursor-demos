
  create or replace   view RAW.JAFFLE_SHOP.show_columns
  
   as (
    

-- Use SHOW COLUMNS to see actual column names
SHOW COLUMNS IN TABLE RAW.jaffle_shop.orders
  );

