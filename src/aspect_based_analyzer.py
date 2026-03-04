"""
File: aspect_based_analyzer.py
Purpose: Extract WHAT features customers talk about and their sentiment
"""

import pandas as pd
import re
from collections import Counter

class AspectAnalyzer:
    def __init__(self):
        # Common product aspects for electronics
        self.aspect_keywords = {
            'battery': ['battery', 'charge', 'charging', 'power', 'backup'],
            'screen': ['screen', 'display', 'resolution', 'brightness'],
            'camera': ['camera', 'photo', 'picture', 'video', 'selfie'],
            'performance': ['speed', 'fast', 'slow', 'lag', 'performance'],
            'design': ['design', 'look', 'style', 'build', 'material'],
            'price': ['price', 'cost', 'expensive', 'cheap', 'value'],
            'software': ['software', 'update', 'app', 'interface', 'os']
        }
    
    def extract_aspects(self, text):
        """Extract product aspects mentioned in text"""
        aspects_found = []
        text_lower = str(text).lower()  # Ensure it's a string
        
        for aspect, keywords in self.aspect_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    aspects_found.append(aspect)
                    break  # Found this aspect, move to next
        
        return list(set(aspects_found))  # Remove duplicates
    
    def analyze_reviews(self, reviews_df):
        """Analyze aspects across all reviews"""
        print("\n🔍 Performing Aspect-Based Sentiment Analysis...")
        
        results = []
        
        for idx, row in reviews_df.iterrows():
            text = str(row['review_text'])
            aspects = self.extract_aspects(text)
            
            # Get sentiment for this review
            sentiment = row.get('sentiment_label', 'NEUTRAL')
            sentiment_score = float(row.get('sentiment_score', 0.5))  # Convert to float
            
            for aspect in aspects:
                results.append({
                    'review_id': int(idx),  # Convert to int
                    'aspect': aspect,
                    'sentiment': sentiment,
                    'sentiment_score': sentiment_score,
                    'text_snippet': text[:100] + '...' if len(text) > 100 else text
                })
        
        aspect_df = pd.DataFrame(results)
        
        # Generate insights
        self.generate_aspect_insights(aspect_df)
        
        return aspect_df
    
    def generate_aspect_insights(self, aspect_df):
        """Generate business insights from aspect analysis"""
        print("\n📊 ASPECT ANALYSIS RESULTS:")
        print("="*50)
        
        if len(aspect_df) == 0:
            print("No aspects found in reviews")
            return
        
        # 1. Most discussed aspects
        aspect_counts = aspect_df['aspect'].value_counts()
        print("\nTOP DISCUSSED FEATURES:")
        for aspect, count in aspect_counts.head(5).items():
            print(f"  • {aspect.upper()}: {int(count)} mentions")  # Convert to int
        
        # 2. Sentiment by aspect
        print("\nSENTIMENT BY FEATURE (Positive %):")
        for aspect in aspect_counts.index[:5]:
            aspect_data = aspect_df[aspect_df['aspect'] == aspect]
            if len(aspect_data) > 0:
                positive_pct = (aspect_data['sentiment'] == 'POSITIVE').sum() / len(aspect_data) * 100
                print(f"  • {aspect.upper()}: {positive_pct:.1f}% positive")
        
        # 3. Problem areas (aspects with high negative sentiment)
        print("\n⚠️ POTENTIAL PROBLEM AREAS:")
        problem_found = False
        for aspect in aspect_counts.index:
            aspect_data = aspect_df[aspect_df['aspect'] == aspect]
            if len(aspect_data) > 10:  # Only if enough data
                negative_pct = (aspect_data['sentiment'] == 'NEGATIVE').sum() / len(aspect_data) * 100
                if negative_pct > 40:  # Threshold for problem
                    print(f"  • {aspect.upper()}: {negative_pct:.1f}% negative reviews")
                    problem_found = True
        
        if not problem_found:
            print("  • No major problem areas detected (all aspects < 40% negative)")
        
        # Save insights to file
        insights = {
            'total_aspect_mentions': int(len(aspect_df)),  # Convert to int
            'unique_aspects_found': int(len(aspect_counts)),  # Convert to int
            'top_aspect': str(aspect_counts.index[0]) if len(aspect_counts) > 0 else None,  # Convert to string
            'top_aspect_count': int(aspect_counts.iloc[0]) if len(aspect_counts) > 0 else 0,  # Convert to int
            'aspect_summary': {}
        }
        
        # Add sentiment percentages for top aspects
        for aspect in aspect_counts.index[:5]:
            aspect_data = aspect_df[aspect_df['aspect'] == aspect]
            if len(aspect_data) > 0:
                positive_pct = float((aspect_data['sentiment'] == 'POSITIVE').sum() / len(aspect_data) * 100)
                insights['aspect_summary'][aspect] = {
                    'mentions': int(aspect_counts[aspect]),
                    'positive_percentage': round(positive_pct, 1)
                }
        
        import json
        with open('research/results/aspect_insights.json', 'w') as f:
            json.dump(insights, f, indent=4, default=str)  # Added default=str for safety
        
        print(f"\n💾 Aspect insights saved to research/results/aspect_insights.json")