# check_data.py
import os
import pandas as pd

print("Checking for dataset...")

data_paths = [
    'data/raw/amazon_reviews.csv',
    'data/raw/reviews.csv',
    'amazon_reviews.csv'
]

found = False
for path in data_paths:
    if os.path.exists(path):
        print(f"✅ Found: {path}")
        # Try to read a few rows
        try:
            df = pd.read_csv(path, nrows=5)
            print(f"   Columns: {list(df.columns)}")
            print(f"   Shape: {df.shape}")
            found = True
            break
        except Exception as e:
            print(f"   Error reading: {e}")
    else:
        print(f"❌ Not found: {path}")

if not found:
    print("\n⚠️ No dataset found. We'll create sample data for now.")
    print("Please download from Kaggle and save to data/raw/amazon_reviews.csv")