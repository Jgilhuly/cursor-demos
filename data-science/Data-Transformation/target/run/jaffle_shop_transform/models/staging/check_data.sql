
  create or replace   view RAW.JAFFLE_SHOP.check_data
  
   as (
    

-- Let's try to get columns by position using $1, $2, etc.
SELECT 
    $1 as col1,
    $2 as col2,
    $3 as col3,
    $4 as col4
FROM RAW.jaffle_shop.orders
LIMIT 5
  );

