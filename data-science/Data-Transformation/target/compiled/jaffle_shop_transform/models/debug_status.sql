

SELECT 
    status as value_field,
    count(*) as n_records
FROM RAW.jaffle_shop.orders
GROUP BY status
ORDER BY status