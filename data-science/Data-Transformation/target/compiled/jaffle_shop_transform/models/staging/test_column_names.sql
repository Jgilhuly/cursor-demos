

-- Test various possible column names
SELECT 
    -- Try common variations of column names
    try_cast($1 as varchar) as col1_value,
    try_cast($2 as varchar) as col2_value,
    try_cast($3 as varchar) as col3_value,
    try_cast($4 as varchar) as col4_value,
    -- Also get the data types
    typeof($1) as col1_type,
    typeof($2) as col2_type,
    typeof($3) as col3_type,
    typeof($4) as col4_type
FROM RAW.jaffle_shop.orders
LIMIT 3