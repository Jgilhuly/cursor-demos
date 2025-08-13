

SELECT 
    column_name,
    data_type,
    is_nullable,
    ordinal_position
FROM information_schema.columns 
WHERE table_catalog = 'RAW' 
  AND table_schema = 'JAFFLE_SHOP' 
  AND table_name = 'ORDERS'
ORDER BY ordinal_position