import pandas as pd

# Load the aligned market data
market = pd.read_csv('data/processed/market_data_aligned.csv')
market['date'] = pd.to_datetime(market['date'])   

# Load sentiment data
sentiment = pd.read_csv('data/processed/daily_sentiment.csv')
if 'date' not in sentiment.columns:
    sentiment['date'] = pd.to_datetime(sentiment.index)
else:
    sentiment['date'] = pd.to_datetime(sentiment['date'])

print('Market data:')
print(f'  Records: {len(market)}')
print(f'  Date range: {market["date"].min().date()} to {market["date"].max().date()}')

print('\nSentiment data:')
print(f'  Records: {len(sentiment)}')
print(f'  Date range: {sentiment["date"].min().date()} to {sentiment["date"].max().date()}')       

# Check overlap
common_dates = set(market['date'].dt.date).intersection(set(sentiment['date'].dt.date))
print(f'\nOverlapping dates: {len(common_dates)}')
if common_dates:
    print(f'  Example dates: {list(common_dates)[:5]}')