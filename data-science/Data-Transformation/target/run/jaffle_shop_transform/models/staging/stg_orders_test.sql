
  create or replace   view RAW.JAFFLE_SHOP.stg_orders_test
  
   as (
    

SELECT * FROM RAW.jaffle_shop.orders LIMIT 5
  );

