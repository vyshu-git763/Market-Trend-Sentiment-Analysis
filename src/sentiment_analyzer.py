"""
File: sentiment_analyzer.py
Purpose: Analyze sentiment of reviews using AI (DistilBERT)
"""

import pandas as pd
import numpy as np
from transformers import pipeline
from tqdm import tqdm
import warnings
warnings.filterwarnings('ignore')

class SentimentAnalyzer:
    def __init__(self):
        """Initialize the sentiment analyzer"""
        print("🤖 Loading DistilBERT sentiment model...")
        try:
            self.analyzer = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english"
            )
            print("   ✅ Model loaded successfully!")
        except Exception as e:
            print(f"   ❌ Error loading model: {e}")
            self.analyzer = None
    
    def analyze_text(self, text):
        """Analyze sentiment of a single text"""
        if not text or str(text).strip() == "":
            return {'label': 'NEUTRAL', 'score': 0.5}
        
        try:
            # Limit text length for the model
            text = str(text)[:512]
            result = self.analyzer(text)[0]
            return {
                'label': result['label'],
                'score': result['score']
            }
        except:
            return {'label': 'NEUTRAL', 'score': 0.5}
    
    def analyze_batch(self, texts, batch_size=32):
        """Analyze multiple texts efficiently"""
        print(f"   Analyzing {len(texts):,} texts...")
        
        results = []
        for i in tqdm(range(0, len(texts), batch_size), desc="Processing"):
            batch = texts[i:i + batch_size]
            try:
                if self.analyzer:
                    batch_results = self.analyzer(batch)
                else:
                    batch_results = [{'label': 'NEUTRAL', 'score': 0.5} for _ in batch]
                
                results.extend(batch_results)
            except:
                # If batch fails, analyze individually
                for text in batch:
                    results.append(self.analyze_text(text))
        
        return results
    
    def analyze_reviews(self, reviews_df, sample_size=1000):
        """
        Analyze a sample of reviews
        sample_size: Number of reviews to analyze (for speed)
        """
        print(f"\n🔍 Analyzing {sample_size:,} reviews...")
        
        # Take a sample
        sample_df = reviews_df.sample(min(sample_size, len(reviews_df)), random_state=42)
        
        # Get texts
        texts = sample_df['review_text'].tolist()
        
        # Analyze
        results = self.analyze_batch(texts)
        
        # Add results to dataframe
        sample_df = sample_df.reset_index(drop=True)
        sample_df['sentiment_label'] = [r['label'] for r in results]
        sample_df['sentiment_score'] = [r['score'] for r in results]
        
        # Convert to numeric score for analysis
        sample_df['sentiment_numeric'] = sample_df['sentiment_label'].apply(
            lambda x: 1 if x == 'POSITIVE' else -1
        )
        
        # Calculate accuracy vs ratings (if available)
        if 'rating' in sample_df.columns:
            sample_df['rating_sentiment'] = sample_df['rating'].apply(
                lambda x: 1 if x >= 4 else (-1 if x <= 2 else 0)
            )
            
            accuracy = (sample_df['sentiment_numeric'] == sample_df['rating_sentiment']).mean()
            print(f"   📊 Accuracy vs user ratings: {accuracy:.2%}")
        
        # Show sentiment distribution
        pos = (sample_df['sentiment_label'] == 'POSITIVE').sum()
        neg = (sample_df['sentiment_label'] == 'NEGATIVE').sum()
        neu = (sample_df['sentiment_label'] == 'NEUTRAL').sum()
        
        print(f"   📈 Sentiment distribution:")
        print(f"      Positive: {pos:,} ({pos/len(sample_df):.1%})")
        print(f"      Negative: {neg:,} ({neg/len(sample_df):.1%})")
        print(f"      Neutral:  {neu:,} ({neu/len(sample_df):.1%})")
        print(f"   Average confidence: {sample_df['sentiment_score'].mean():.1%}")
        
        return sample_df
    
    def create_daily_sentiment(self, analyzed_df):
        """Create daily sentiment time series"""
        print("\n   Creating daily sentiment time series...")
        
        # Aggregate by date
        analyzed_df['date'] = analyzed_df['review_date'].dt.date
        daily_sentiment = analyzed_df.groupby('date').agg({
            'sentiment_numeric': 'mean',
            'sentiment_score': 'mean',
            'review_text': 'count'
        }).rename(columns={
            'review_text': 'analyzed_reviews',
            'sentiment_numeric': 'sentiment_score',
            'sentiment_score': 'sentiment_confidence'
        })
        
        print(f"      Created {len(daily_sentiment)} days of sentiment data")
        return daily_sentiment

# Test the sentiment analyzer
if __name__ == "__main__":
    # Load some data first
    from data_loader import DataLoader
    
    print("Testing Sentiment Analyzer...")
    print("="*50)
    
    # Load data
    loader = DataLoader()
    reviews = loader.load_reviews(sample_size=100)
    
    # Initialize analyzer
    analyzer = SentimentAnalyzer()
    
    # Analyze
    analyzed_df = analyzer.analyze_reviews(reviews, sample_size=50)
    
    # Create daily sentiment
    daily_sentiment = analyzer.create_daily_sentiment(analyzed_df)
    
    print("\n" + "="*50)
    print("✅ Sentiment analyzer test complete!")
    print("="*50)
    
    # Show sample results
    print("\nSample analyzed reviews:")
    print(analyzed_df[['review_text', 'rating', 'sentiment_label', 'sentiment_score']].head(3))
    
    print("\nDaily sentiment (first 5 days):")
    print(daily_sentiment.head())