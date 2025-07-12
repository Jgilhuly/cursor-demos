# Legacy Pandas Pipeline

A demonstration project showcasing inefficient pandas operations that can be optimized using modern data processing techniques.

## Overview

This project contains a **deliberately inefficient** user analytics pipeline built with pandas. It demonstrates common anti-patterns that slow down data processing and consume excessive memory.

Perfect for demonstrating how AI-powered code optimization tools like Cursor can dramatically improve performance.

## Dataset

The project includes three CSV files with synthetic user analytics data:

- `user_data.csv` - User demographics and account information (~1K users)
- `user_sessions.csv` - Session tracking data (~5K sessions)  
- `user_events.csv` - Individual user event data (~25K events)

## Performance Anti-Patterns Included

1. **Using `iterrows()` instead of vectorized operations**
   - Engagement score calculation using row-by-row iteration
   - 10-50x slower than vectorized operations

2. **Inefficient string operations with `apply()`**
   - Email domain categorization using complex apply functions
   - Should use pandas `.str` methods and `.map()` instead

3. **Nested loops for aggregations**
   - User metrics calculation with nested loops over DataFrames
   - Should use `groupby()` operations instead

4. **Memory-inefficient operations** 
   - Creating multiple unnecessary intermediate DataFrames
   - Inefficient merge operations and data copying

5. **Inefficient categorical operations**
   - Using `apply()` with lambda functions for simple conditions
   - Should use `pandas.cut()` or `numpy.select()` instead

## Setup Instructions

1. Run the `user_analytics_pipeline.ipynb` notebook.

## Expected Performance Issues

When running the notebook, you should observe:

- **Slow execution times** - Several operations take 1-5 seconds each
- **High memory usage** - Multiple unnecessary DataFrame copies
- **Inefficient processing** - Overall runtime of 10-20 seconds for small dataset

## Optimization Opportunities

This codebase is perfect for demonstrating how AI-powered tools can:

- **Identify performance bottlenecks** automatically
- **Suggest vectorized alternatives** to iterative operations
- **Optimize memory usage** by eliminating unnecessary copies
- **Refactor string operations** to use pandas built-in methods
- **Replace nested loops** with efficient groupby operations

## Expected Improvements

After optimization, you should see:
- **5-10x faster execution**
- **50-70% less memory usage**  
- **Cleaner, more maintainable code**
- **Better pandas best practices**

## Files

- `user_analytics_pipeline.ipynb` - Main notebook with inefficient code
- `generate_data.py` - Script to create sample datasets
- `requirements.txt` - Python dependencies
- `user_data.csv` - Generated user data
- `user_sessions.csv` - Generated session data  
- `user_events.csv` - Generated event data

## Usage for Demos

1. Open the notebook and run all cells to show current (slow) performance
2. Use your optimization tool to identify and fix the anti-patterns
3. Re-run to demonstrate the performance improvements
4. Compare before/after execution times and memory usage

This project provides a realistic but manageable example of legacy pandas code that benefits significantly from modern optimization techniques. 