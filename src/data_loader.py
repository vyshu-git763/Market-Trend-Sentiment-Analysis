"""
File: data_loader.py
Purpose: Load and clean Amazon reviews dataset
"""

import pandas as pd
import numpy as np
from datetime import datetime
import os

class DataLoader:
    def __init__(self):
        self.reviews_df = None
        self.market_df = None
        
    def load_reviews(self, file_path='data/raw/amazon_reviews.csv', sample_size=10000):
        """
        Load Amazon reviews and clean them
        sample_size: Number of reviews to load (for speed)
        """
        print("📂 Loading Amazon reviews...")
        
        try:
            # Load data
            df = pd.read_csv(file_path, nrows=sample_size)
            print(f"   Loaded {len(df):,} reviews")
            
            # Rename columns for clarity
            column_mapping = {
                'Text': 'review_text',
                'Score': 'rating',
                'Time': 'unix_time',
                'ProductId': 'product_id',
                'Summary': 'summary'
            }
            
            # Apply renaming
            for old_name, new_name in column_mapping.items():
                if old_name in df.columns:
                    df = df.rename(columns={old_name: new_name})
            
            # Convert Unix time to datetime
            if 'unix_time' in df.columns:
                df['review_date'] = pd.to_datetime(df['unix_time'], unit='s')
                df = df.drop('unix_time', axis=1)
            else:
                # Create sample dates if no time column
                df['review_date'] = pd.date_range(
                    start='2023-01-01', 
                    periods=len(df),
                    freq='D'
                )
            
            # Clean text
            df['review_text'] = df['review_text'].fillna('').astype(str)
            
            # Remove empty reviews
            df = df[df['review_text'].str.strip() != '']
            
            # Add category (Electronics for all)
            df['category'] = 'Electronics'
            
            print(f"   ✅ Cleaned: {len(df):,} reviews")
            print(f"   Date range: {df['review_date'].min().date()} to {df['review_date'].max().date()}")
            print(f"   Avg rating: {df['rating'].mean():.2f}")
            
            self.reviews_df = df
            return df
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return self._create_sample_data()
    
    def _create_sample_data(self):
        """Create sample data if loading fails"""
        print("   Creating sample data...")
        
        n = 1000
        products = ['Smartphone', 'Laptop', 'Tablet']
        
        data = []
        for i in range(n):
            product = np.random.choice(products)
            rating = np.random.choice([1, 2, 3, 4, 5], p=[0.1, 0.15, 0.2, 0.3, 0.25])
            
            if rating >= 4:
                text = f"Excellent {product}! Love it."
            elif rating <= 2:
                text = f"Poor {product}. Disappointed."
            else:
                text = f"Okay {product}. Average."
            
            data.append({
                'review_text': text,
                'rating': rating,
                'product_id': f'PROD{np.random.randint(1000, 9999)}',
                'review_date': pd.Timestamp('2023-01-01') + pd.Timedelta(days=np.random.randint(0, 365)),
                'category': 'Electronics'
            })
        
        df = pd.DataFrame(data)
        self.reviews_df = df
        return df
    
    def generate_market_data(self):
        """
        Generate simulated stock market data matching sentiment dates
        """
        print("\n📊 Generating market data...")
        
        # Match sentiment data date range (2000-2012)
        dates = pd.date_range(start='2000-01-01', end='2012-12-31', freq='D')
        
        # Simulate stock prices (random walk)
        np.random.seed(42)
        prices = [100]
        for i in range(1, len(dates)):
            change = np.random.normal(0.001, 0.015)
            prices.append(prices[-1] * (1 + change))
        
        # Create DataFrame
        df = pd.DataFrame({
            'date': dates,
            'stock_price': prices,
            'volume': np.random.randint(1000000, 5000000, len(dates))
        })
        
        # Add price changes
        df['price_change_pct'] = df['stock_price'].pct_change() * 100
        
        print(f"   ✅ Generated {len(df)} days of market data")
        print(f"   Date range: {df['date'].min().date()} to {df['date'].max().date()}")
        
        self.market_df = df
        return df
    
    def align_dates_with_reviews(self):
        """Align market data dates with review dates"""
        print("\n📅 Aligning dates between reviews and market data...")
        
        if self.reviews_df is None or self.market_df is None:
            print("   ❌ No data to align")
            return None
        
        # Get review date range
        review_min_date = self.reviews_df['review_date'].min()
        review_max_date = self.reviews_df['review_date'].max()
        
        print(f"   Review date range: {review_min_date.date()} to {review_max_date.date()}")
        print(f"   Market date range: {self.market_df['date'].min().date()} to {self.market_df['date'].max().date()}")
        
        # Filter market data to match review dates
        aligned_market = self.market_df[
            (self.market_df['date'] >= review_min_date) & 
            (self.market_df['date'] <= review_max_date)
        ].copy()
        
        if len(aligned_market) == 0:
            print("   ⚠️ No overlapping dates. Using original market data.")
            aligned_market = self.market_df.copy()
        
        print(f"   ✅ Aligned market data: {len(aligned_market)} days")
        
        return aligned_market
    
    def save_processed_data(self):
        """Save cleaned data for later use"""
        os.makedirs('data/processed', exist_ok=True)
        
        if self.reviews_df is not None:
            self.reviews_df.to_csv('data/processed/amazon_reviews_clean.csv', index=False)
            print("   💾 Saved cleaned reviews to data/processed/amazon_reviews_clean.csv")
        
        if self.market_df is not None:
            self.market_df.to_csv('data/processed/market_data.csv', index=False)
            print("   💾 Saved market data to data/processed/market_data.csv")
            
            # Also save aligned version
            aligned = self.align_dates_with_reviews()
            if aligned is not None:
                aligned.to_csv('data/processed/market_data_aligned.csv', index=False)
                print("   💾 Saved aligned market data to data/processed/market_data_aligned.csv")

# Test the data loader
if __name__ == "__main__":
    loader = DataLoader()
    
    # Test loading
    reviews = loader.load_reviews(sample_size=5000)
    print(f"\nSample of loaded data:")
    print(reviews[['review_text', 'rating', 'review_date']].head(3))
    
    # Test market data
    market = loader.generate_market_data()
    
    # Save
    loader.save_processed_data()