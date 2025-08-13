
    
    

select
    order_id as unique_field,
    count(*) as n_records

from RAW.JAFFLE_SHOP.orders_with_unix_date
where order_id is not null
group by order_id
having count(*) > 1


