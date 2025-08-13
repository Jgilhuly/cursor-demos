
  create or replace   view RAW.JAFFLE_SHOP.simple_test
  
   as (
    

-- Simple test to see what the data looks like
SELECT 
    $1 as col1,
    $2 as col2,
    $3 as col3,
    $4 as col4,
    $5 as col5  -- In case there are more columns
FROM RAW.jaffle_shop.orders
LIMIT 2
  );

