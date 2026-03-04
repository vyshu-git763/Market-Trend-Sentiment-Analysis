# correlation_stats.py
import pandas as pd
import numpy as np
from scipy import stats

print("Calculating Correlation Statistics for Paper...")
print("="*60)

# Load your aligned data
market = pd.read_csv('data/processed/market_data_aligned.csv')
sentiment = pd.read_csv('data/processed/daily_sentiment.csv')

# Prepare dates
market['date'] = pd.to_datetime(market['date'])
if 'date' not in sentiment.columns:
    sentiment['date'] = pd.to_datetime(sentiment.index)
else:
    sentiment['date'] = pd.to_datetime(sentiment['date'])

# Merge
merged = pd.merge(market, sentiment, on='date', how='inner')
print(f"Merged data points: {len(merged)}")

# Calculate all statistics
pearson_corr, pearson_p = stats.pearsonr(merged['sentiment_score'], merged['stock_price'])
spearman_corr, spearman_p = stats.spearmanr(merged['sentiment_score'], merged['stock_price'])

# Linear regression
slope, intercept, r_value, p_value, std_err = stats.linregress(
    merged['sentiment_score'], merged['stock_price']
)

print(f"\n📊 CORRELATION STATISTICS:")
print(f"1. Pearson Correlation: {pearson_corr:.3f} (p-value: {pearson_p:.4f})")
print(f"2. Spearman Correlation: {spearman_corr:.3f} (p-value: {spearman_p:.4f})")
print(f"3. R-squared: {r_value**2:.3f}")
print(f"4. Regression slope: {slope:.3f}")
print(f"5. Sample size: {len(merged)} days")

if pearson_p < 0.05:
    print(f"✅ Statistically significant! (p < 0.05)")
else:
    print(f"⚠️ Not statistically significant at 95% confidence")

# Save for paper
stats_results = {
    'pearson_correlation': round(pearson_corr, 3),
    'pearson_p_value': round(pearson_p, 4),
    'spearman_correlation': round(spearman_corr, 3),
    'spearman_p_value': round(spearman_p, 4),
    'r_squared': round(r_value**2, 3),
    'regression_slope': round(slope, 3),
    'sample_size': len(merged),
    'date_range': f"{merged['date'].min().date()} to {merged['date'].max().date()}"
}

import json
with open('research/results/correlation_stats.json', 'w') as f:
    json.dump(stats_results, f, indent=4)

print(f"\n💾 Saved to: research/results/correlation_stats.json")