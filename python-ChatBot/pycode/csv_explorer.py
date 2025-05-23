import pandas as pd

# Load the CSV file
df = pd.read_csv('gearvn_products_transformed.csv')

# Print the first few rows
print("First 5 rows:")
print(df.head())

# Print column names
print("\nColumn names:")
print(df.columns.tolist())

# Print basic info about the dataframe
print("\nBasic information:")
print(df.info())

# Print some statistics
print("\nBasic statistics:")
print(df.describe()) 