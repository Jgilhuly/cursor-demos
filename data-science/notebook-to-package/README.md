# Notebook-to-Package Demo

This project demonstrates converting a messy Jupyter notebook into a well-structured Python package using Cursor AI.

## Project Overview

The `user_behavior_analysis.ipynb` notebook contains a user behavior analysis that showcases common issues found in real-world data science projects:

### Possible Problems to Fix

1. **Hardcoded File Paths**: The notebook uses absolute paths that won't work on other machines
2. **Mixed Concerns**: Analysis, plotting, and utility functions are all mixed together in cells
3. **Duplicate Code**: Device analysis is performed multiple times with similar logic
4. **Hardcoded Values**: Magic numbers and thresholds are embedded throughout
5. **Inconsistent Naming**: Mix of snake_case and camelCase function names
6. **No Modularity**: All code is in one notebook with no reusable components
7. **No Configuration**: Parameters are scattered throughout the code
8. **No Error Handling**: No validation or error handling for data issues

### What Cursor Can Help With

- **Extract Reusable Functions**: Convert notebook cells into proper Python modules
- **Create Configuration Files**: Move hardcoded values to config files
- **Improve Code Organization**: Separate data loading, analysis, and visualization
- **Add Error Handling**: Make code more robust and production-ready
- **Standardize Naming**: Fix inconsistent naming conventions
- **Create Package Structure**: Convert to proper Python package with setup.py

### Example Agent Prompt
```
We need to convert this notebook to a python package. First, analyze the notebook and identify areas that we can improve the code as we migrate. Create a todo list of items to tackle.
```

```
Execute this plan.
```

## Getting Started

1. Run the `user_behavior_analysis.ipynb` notebook directly.

1. Use Cursor AI to refactor the messy code into a clean package structure!

## Expected Package Structure After Refactoring

```
user_behavior_analysis/
├── __init__.py
├── config.py
├── data_loader.py
├── analyzers/
│   ├── __init__.py
│   ├── engagement_analyzer.py
│   ├── geographic_analyzer.py
│   └── referrer_analyzer.py
├── visualizers/
│   ├── __init__.py
│   └── charts.py
├── utils/
│   ├── __init__.py
│   └── helpers.py
└── main.py
```