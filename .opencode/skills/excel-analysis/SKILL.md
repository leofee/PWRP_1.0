---
name: excel-analysis
description: Use when the user asks to read, analyze, or manipulate Excel files (.xlsx, .xls). Covers loading data, summary stats, filtering, sorting, and exporting results using pandas + openpyxl.
---

# Excel Analysis

## Environment
- Python with `pandas` + `openpyxl` (already installed)
- Run via: `py -c "..."` or `py path/to/script.py`
- Working directory is the project root

## Common operations

### Read all sheets
```python
import pandas as pd
xls = pd.ExcelFile("path/to/file.xlsx")
print(xls.sheet_names)
df = pd.read_excel(xls, sheet_name="Sheet1")
print(df.head())
print(df.describe())
```

### Basic analysis
- `df.info()` — column types, non-null counts
- `df.describe()` — numeric summary stats
- `df["col"].value_counts()` — frequency counts
- `df.groupby("col").mean()` — grouped aggregation

### Filter
```python
df[df["column"] > value]
df.query("column == @variable")
```

### Export results
```python
df.to_csv("output.csv", index=False)
```

## Path convention
Place Excel files in the project root or a `data/` directory. Use absolute or relative paths from project root.
