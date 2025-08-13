
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select order_id
from RAW.JAFFLE_SHOP.orders_with_unix_date
where order_id is null



  
  
      
    ) dbt_internal_test