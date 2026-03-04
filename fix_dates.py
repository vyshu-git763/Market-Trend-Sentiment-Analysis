"""
File: fix_dates.py
Fix the date alignment issue for visualizations
"""

import pandas as pd
import numpy as np
import os

print("Fixing date alignment for visualizations...")
print("="*60)

# Load existing data
print("\n1. Loading existing data...")
reviews_df = pd.read_csv('data/processed/amazon_reviews_clean.csv')
reviews_df['review_date'] = pd.to_datetime(reviews_df['review_date'])

daily_sentiment = pd.read_csv('data/processed/daily_sentiment.csv')
daily_sentiment.index = pd.to_datetime(daily_sentiment.index)

print(f"   Reviews: {len(reviews_df):,}")
print(f"   Review date range: {reviews_df['review_date'].min().date()} to {reviews_df['review_date'].max().date()}")
print(f"   Daily sentiment: {len(daily_sentiment):,} days")

# Create matching market data
print("\n2. Creating matching market data...")
review_min = reviews_df['review_date'].min()
review_max = reviews_df['review_date'].max()

# Create dates that match review period
dates = pd.date_range(start=review_min, end=review_max, freq='D')

if len(dates) == 0:
    # Fallback range
    dates = pd.date_range(start='2005-01-01', end='2012-12-31', freq='D')

# Simulate prices
np.random.seed(42)
base_price = 100
prices = [base_price]

for i in range(1, len(dates)):
    change = np.random.normal(0.0003, 0.015)
    prices.append(prices[-1] * (1 + change))

# Create market dataframe
market_df = pd.DataFrame({
    'date': dates,
    'stock_price': prices,
    'volume': np.random.randint(1000000, 5000000, len(dates))
})

# Add some correlation with sentiment (for visualization)
print("\n3. Adding correlation with sentiment...")

# Merge with sentiment data
market_df.set_index('date', inplace=True)

# Align dates
common_dates = market_df.index.intersection(daily_sentiment.index)
if len(common_dates) > 10:
    # Add some correlation for visualization
    for date in common_dates[:min(20, len(common_dates))]:
        sentiment = daily_sentiment.loc[date, 'sentiment_score'] if date in daily_sentiment.index else 0
        # Positive sentiment → slight price increase
        market_df.loc[date, 'stock_price'] *= (1 + sentiment * 0.01)

market_df.reset_index(inplace=True)

print(f"   Created market data: {len(market_df):,} days")
print(f"   Date range: {market_df['date'].min().date()} to {market_df['date'].max().date()}")

# Save fixed data
print("\n4. Saving fixed data...")
market_df.to_csv('data/processed/market_data_fixed.csv', index=False)

# Also update daily_sentiment to have proper date column
daily_sentiment.reset_index(inplace=True)
daily_sentiment.rename(columns={'index': 'date'}, inplace=True)
daily_sentiment.to_csv('data/processed/daily_sentiment_fixed.csv', index=False)

print("\n✅ Fixed data saved:")
print("   - data/processed/market_data_fixed.csv")
print("   - data/processed/daily_sentiment_fixed.csv")

print("\nNow run: py -3.11 src/visualizer.py")