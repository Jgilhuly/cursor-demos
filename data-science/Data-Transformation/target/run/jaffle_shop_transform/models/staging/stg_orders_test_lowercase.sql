
  create or replace   view RAW.JAFFLE_SHOP.stg_orders_test_lowercase
  
   as (
    

SELECT 
    id,
    user_id,
    order_date,
    status
FROM RAW.jaffle_shop.orders 
LIMIT 5
  );

