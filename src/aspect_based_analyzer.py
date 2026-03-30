"""
File: aspect_based_analyzer.py
Purpose: Extract WHAT features customers talk about using dynamic domain detection
"""

import pandas as pd
import re
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

class AspectAnalyzer:
    def __init__(self):
        # Domain-specific keyword dictionaries
        self.domain_keywords = {
            'electronics': {
                'battery': ['battery', 'charge', 'charging', 'power', 'backup', 'lasts'],
                'screen': ['screen', 'display', 'resolution', 'brightness', 'clear'],
                'camera': ['camera', 'photo', 'picture', 'video', 'selfie', 'lens'],
                'performance': ['speed', 'fast', 'slow', 'lag', 'performance', 'quick'],
                'design': ['design', 'look', 'style', 'build', 'material', 'sleek'],
                'price': ['price', 'cost', 'expensive', 'cheap', 'value', 'money', 'worth'],
                'software': ['software', 'update', 'app', 'interface', 'os', 'bug', 'crash']
            },
            'restaurant_food': {
                'food_quality': ['delicious', 'tasty', 'fresh', 'flavor', 'seasoning', 'cooked', 'quality'],
                'service': ['service', 'staff', 'waiter', 'friendly', 'rude', 'helpful', 'slow'],
                'delivery': ['delivery', 'arrived', 'packaging', 'warm', 'cold', 'time', 'quick'],
                'portion': ['portion', 'size', 'generous', 'small', 'tiny', 'huge', 'amount'],
                'price': ['price', 'cost', 'expensive', 'cheap', 'value', 'money', 'worth', 'overpriced'],
                'hygiene': ['hygiene', 'clean', 'dirty', 'hair', 'spill', 'packaging'],
                'menu': ['menu', 'options', 'variety', 'choices', 'selection', 'limited']
            },
            'general': {
                'quality': ['quality', 'good', 'bad', 'excellent', 'poor', 'great', 'terrible'],
                'value': ['value', 'worth', 'money', 'price', 'cost', 'expensive', 'cheap'],
                'experience': ['experience', 'happy', 'disappointed', 'satisfied', 'frustrated'],
                'recommendation': ['recommend', 'suggest', 'advice', 'warning', 'avoid'],
                'expectations': ['expectation', 'expected', 'surprised', 'disappointed', 'exceeded']
            }
        }
    
    def detect_domain(self, texts):
        """Automatically detect the domain based on text content"""
        sample_text = ' '.join(texts[:100]).lower()
        
        # Count domain-specific keywords
        scores = {}
        for domain, aspects in self.domain_keywords.items():
            score = 0
            for aspect_words in aspects.values():
                for word in aspect_words:
                    score += sample_text.count(word)
            scores[domain] = score
        
        # Return domain with highest score, default to general
        detected = max(scores, key=scores.get)
        return detected if scores[detected] > 5 else 'general'
    
    def extract_aspects(self, text, domain='general'):
        """Extract product aspects mentioned in text"""
        aspects_found = []
        text_lower = str(text).lower()
        
        # Use domain-specific keywords
        keywords_dict = self.domain_keywords.get(domain, self.domain_keywords['general'])
        
        for aspect, keywords in keywords_dict.items():
            for keyword in keywords:
                if keyword in text_lower:
                    aspects_found.append(aspect)
                    break
        
        return list(set(aspects_found))
    
    def extract_dynamic_aspects(self, texts, top_n=8):
        """Dynamically extract aspects using TF-IDF for unknown domains"""
        try:
            # Use TF-IDF to find important terms
            vectorizer = TfidfVectorizer(
                max_features=100,
                stop_words='english',
                ngram_range=(1, 2),
                min_df=2
            )
            
            tfidf_matrix = vectorizer.fit_transform(texts)
            feature_names = vectorizer.get_feature_names_out()
            
            # Get average TF-IDF scores
            scores = np.mean(tfidf_matrix.toarray(), axis=0)
            top_indices = scores.argsort()[-top_n:][::-1]
            
            dynamic_aspects = {}
            for idx in top_indices:
                term = feature_names[idx]
                # Group similar terms (simple approach)
                category = self._categorize_term(term)
                if category not in dynamic_aspects:
                    dynamic_aspects[category] = []
                dynamic_aspects[category].append(term)
            
            return dynamic_aspects
            
        except Exception as e:
            print(f"   ⚠️ Dynamic aspect extraction failed: {e}")
            return {}
    
    def _categorize_term(self, term):
        """Simple categorization of terms"""
        food_terms = ['food', 'meal', 'dish', 'cuisine', 'taste', 'flavor']
        service_terms = ['service', 'delivery', 'staff', 'support', 'help']
        quality_terms = ['quality', 'good', 'bad', 'excellent', 'poor']
        
        if any(t in term for t in food_terms):
            return 'food_quality'
        elif any(t in term for t in service_terms):
            return 'service'
        elif any(t in term for t in quality_terms):
            return 'quality'
        else:
            return 'general'
    
    def analyze_reviews(self, reviews_df):
        """Analyze aspects across all reviews with automatic domain detection"""
        print("\n🔍 Performing Aspect-Based Sentiment Analysis...")
        
        # Detect domain automatically
        texts = reviews_df['review_text'].tolist()
        domain = self.detect_domain(texts)
        print(f"   Detected domain: {domain.upper()}")
        
        results = []
        
        for idx, row in reviews_df.iterrows():
            text = str(row['review_text'])
            aspects = self.extract_aspects(text, domain)
            
            # Get sentiment for this review
            sentiment = row.get('sentiment_label', 'NEUTRAL')
            sentiment_score = float(row.get('sentiment_score', 0.5))
            
            for aspect in aspects:
                results.append({
                    'review_id': int(idx),
                    'aspect': aspect,
                    'sentiment': sentiment,
                    'sentiment_score': sentiment_score,
                    'text_snippet': text[:100] + '...' if len(text) > 100 else text
                })
        
        aspect_df = pd.DataFrame(results)
        
        # If no aspects found, try dynamic extraction
        if len(aspect_df) == 0:
            print("   No standard aspects found. Trying dynamic extraction...")
            dynamic_aspects = self.extract_dynamic_aspects(texts)
            print(f"   Dynamic aspects found: {list(dynamic_aspects.keys())}")
        
        # Generate insights
        self.generate_aspect_insights(aspect_df, domain)
        
        return aspect_df
    
    def generate_aspect_insights(self, aspect_df, domain='general'):
        """Generate business insights from aspect analysis"""
        print("\n📊 ASPECT ANALYSIS RESULTS:")
        print("="*50)
        
        if len(aspect_df) == 0:
            print("No aspects found in reviews")
            # Create empty results file
            import json
            os.makedirs('research/results', exist_ok=True)
            with open('research/results/aspect_insights.json', 'w') as f:
                json.dump({
                    'total_aspect_mentions': 0,
                    'unique_aspects_found': 0,
                    'domain': domain,
                    'note': 'No specific aspects detected - using general sentiment only'
                }, f, indent=4)
            return
        
        # 1. Most discussed aspects
        aspect_counts = aspect_df['aspect'].value_counts()
        print("\nTOP DISCUSSED FEATURES:")
        for aspect, count in aspect_counts.head(5).items():
            print(f"  • {aspect.upper()}: {int(count)} mentions")
        
        # 2. Sentiment by aspect
        print("\nSENTIMENT BY FEATURE (Positive %):")
        for aspect in aspect_counts.index[:5]:
            aspect_data = aspect_df[aspect_df['aspect'] == aspect]
            if len(aspect_data) > 0:
                positive_pct = (aspect_data['sentiment'] == 'POSITIVE').sum() / len(aspect_data) * 100
                print(f"  • {aspect.upper()}: {positive_pct:.1f}% positive")
        
        # 3. Problem areas
        print("\n⚠️ POTENTIAL PROBLEM AREAS:")
        problem_found = False
        for aspect in aspect_counts.index:
            aspect_data = aspect_df[aspect_df['aspect'] == aspect]
            if len(aspect_data) > 3:  # Lowered threshold
                negative_pct = (aspect_data['sentiment'] == 'NEGATIVE').sum() / len(aspect_data) * 100
                if negative_pct > 40:
                    print(f"  • {aspect.upper()}: {negative_pct:.1f}% negative reviews")
                    problem_found = True
        
        if not problem_found:
            print("  • No major problem areas detected")
        
        # Save insights
        import json
        import os
        os.makedirs('research/results', exist_ok=True)
        
        insights = {
            'total_aspect_mentions': int(len(aspect_df)),
            'unique_aspects_found': int(len(aspect_counts)),
            'domain': domain,
            'top_aspect': str(aspect_counts.index[0]) if len(aspect_counts) > 0 else None,
            'top_aspect_count': int(aspect_counts.iloc[0]) if len(aspect_counts) > 0 else 0,
            'aspect_summary': {}
        }
        
        for aspect in aspect_counts.index[:5]:
            aspect_data = aspect_df[aspect_df['aspect'] == aspect]
            if len(aspect_data) > 0:
                positive_pct = float((aspect_data['sentiment'] == 'POSITIVE').sum() / len(aspect_data) * 100)
                insights['aspect_summary'][aspect] = {
                    'mentions': int(aspect_counts[aspect]),
                    'positive_percentage': round(positive_pct, 1)
                }
        
        with open('research/results/aspect_insights.json', 'w') as f:
            json.dump(insights, f, indent=4, default=str)
        
        print(f"\n💾 Aspect insights saved to research/results/aspect_insights.json")

# For testing
if __name__ == "__main__":
    # Test with sample data
    import pandas as pd
    
    test_data = pd.DataFrame({
        'review_text': [
            "Food was delicious but delivery was slow",
            "Great service and amazing taste",
            "Portion size too small for the price"
        ],
        'sentiment_label': ['POSITIVE', 'POSITIVE', 'NEGATIVE'],
        'sentiment_score': [0.8, 0.9, 0.3]
    })
    
    analyzer = AspectAnalyzer()
    result = analyzer.analyze_reviews(test_data)
    print(f"\nFound {len(result)} aspect mentions")