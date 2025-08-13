
    
    

with all_values as (

    select
        status as value_field,
        count(*) as n_records

    from RAW.jaffle_shop.orders
    group by status

)

select *
from all_values
where value_field not in (
    'pending','shipped','completed','cancelled'
)


