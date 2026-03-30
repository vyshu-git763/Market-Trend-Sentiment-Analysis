"""
File: aspect_based_analyzer.py
Purpose: Extract WHAT features customers talk about using domain-aware keyword matching
FIXED: Uses exclusive domain signals with regex word-boundary matching to prevent
       misclassifying electronics reviews as food/restaurant domain.
"""

import pandas as pd
import re
from collections import Counter
import numpy as np
import os
import json

class AspectAnalyzer:
    def __init__(self):
        # Domain-specific aspect keyword dictionaries
        self.domain_keywords = {
            'electronics': {
                'battery':     ['battery', 'charging', 'charge', 'power backup', 'battery life', 'dies fast'],
                'screen':      ['screen', 'display', 'resolution', 'brightness', 'backlight', 'lcd', 'oled'],
                'camera':      ['camera', 'photo', 'picture quality', 'video', 'selfie', 'lens', 'megapixel'],
                'performance': ['performance', 'speed', 'processor', 'lag', 'fast', 'slow', 'heating', 'benchmark'],
                'design':      ['design', 'build quality', 'material', 'sleek', 'premium', 'plastic', 'metal'],
                'price':       ['price', 'cost', 'expensive', 'cheap', 'value', 'worth', 'overpriced'],
                'software':    ['software', 'app', 'update', 'interface', 'os', 'bug', 'crash'],
            },
            'food': {
                'food_quality':['taste', 'flavor', 'delicious', 'bland', 'spicy', 'fresh', 'authentic', 'cooked'],
                'service':     ['service', 'staff', 'waiter', 'rude', 'friendly', 'attentive'],
                'delivery':    ['delivery', 'arrived', 'packaging', 'warm', 'cold food', 'on time', 'delivered'],
                'portion':     ['portion', 'quantity', 'generous', 'small portion', 'filling', 'amount'],
                'price':       ['price', 'expensive', 'cheap', 'value', 'overpriced', 'affordable'],
                'hygiene':     ['hygiene', 'clean', 'dirty', 'hair in food', 'contaminated', 'food safety'],
                'menu':        ['menu', 'variety', 'options', 'vegan', 'gluten free', 'selection'],
            },
            'fashion': {
                'quality':     ['fabric', 'material', 'stitching', 'durable', 'cloth quality'],
                'fit':         ['fit', 'size', 'tight', 'loose', 'true to size', 'runs small'],
                'style':       ['style', 'color', 'pattern', 'looks', 'fashionable', 'trendy'],
                'price':       ['price', 'expensive', 'affordable', 'value', 'worth'],
                'delivery':    ['delivery', 'shipping', 'arrived', 'packaging'],
                'comfort':     ['comfort', 'comfortable', 'itchy', 'soft', 'breathable'],
            },
            'hotel': {
                'cleanliness': ['clean', 'dirty', 'hygiene', 'spotless', 'housekeeping'],
                'service':     ['service', 'staff', 'reception', 'helpful', 'rude', 'check in'],
                'location':    ['location', 'central', 'nearby', 'transport', 'convenient'],
                'room':        ['room', 'bed', 'bathroom', 'shower', 'amenities', 'view'],
                'price':       ['price', 'expensive', 'value', 'worth', 'affordable'],
                'food':        ['breakfast', 'restaurant', 'meal', 'buffet', 'dining'],
            },
            'generic': {
                'quality':     ['quality', 'excellent', 'poor', 'great', 'terrible'],
                'price':       ['price', 'expensive', 'cheap', 'value', 'worth'],
                'service':     ['service', 'support', 'helpful', 'rude', 'response'],
                'delivery':    ['delivery', 'shipping', 'arrived', 'late', 'fast'],
                'experience':  ['experience', 'recommend', 'satisfied', 'disappointed'],
                'performance': ['performance', 'efficient', 'reliable', 'works well'],
                'design':      ['design', 'look', 'style', 'appearance', 'build'],
            }
        }

        # EXCLUSIVE domain signal words — unique to each domain
        # These are scored with word-boundary regex to avoid partial matches
        self.domain_signals = {
            'electronics': [
                'battery', 'charger', 'screen', 'display', 'camera', 'processor',
                'phone', 'smartphone', 'laptop', 'tablet', 'device', 'bluetooth',
                'charging', 'software', 'app', 'pixel', 'ram', 'storage',
                'speaker', 'headphone', 'keyboard', 'touchscreen', 'resolution',
                'microphone', 'operating system', 'update', 'firmware'
            ],
            'food': [
                'restaurant', 'meal', 'cuisine', 'dish', 'recipe', 'ingredient',
                'chef', 'waiter', 'menu', 'takeaway', 'delivery order', 'dine',
                'burger', 'pizza', 'pasta', 'sushi', 'curry', 'sandwich',
                'portion', 'flavor', 'delicious', 'tasteless', 'overcooked',
                'food arrived', 'food quality', 'order delivered'
            ],
            'fashion': [
                'fabric', 'cloth', 'outfit', 'dress', 'shirt', 'jeans',
                'fitting', 'size chart', 'wardrobe', 'apparel', 'wear',
                'cotton', 'polyester', 'stitching', 'hemline'
            ],
            'hotel': [
                'hotel', 'resort', 'checkin', 'checkout', 'reception',
                'housekeeping', 'concierge', 'amenity', 'pool', 'spa',
                'room service', 'breakfast buffet', 'front desk'
            ]
        }

    def detect_domain(self, texts):
        """
        Detect domain using exclusive signal word counting with word-boundary matching.
        Returns domain string or 'generic' if confidence is low.
        """
        sample_text = ' '.join(str(t).lower() for t in texts[:200])
        scores = {}

        for domain, signals in self.domain_signals.items():
            score = 0
            for signal in signals:
                # Word-boundary regex — prevents 'taste' matching 'distaste', etc.
                pattern = r'\b' + re.escape(signal) + r'\b'
                count = len(re.findall(pattern, sample_text))
                score += count
            scores[domain] = score

        print(f"   [Domain Detection] Raw scores: {scores}")

        best_domain = max(scores, key=scores.get)
        best_score = scores[best_domain]

        # Need minimum evidence
        if best_score < 3:
            print(f"   [Domain Detection] Insufficient evidence — defaulting to generic")
            return 'generic'

        # Check dominance over second-best
        sorted_scores = sorted(scores.values(), reverse=True)
        if len(sorted_scores) > 1 and sorted_scores[1] > 0:
            ratio = sorted_scores[0] / sorted_scores[1]
            if ratio < 1.5:
                print(f"   [Domain Detection] Ambiguous (ratio={ratio:.2f}) — using generic")
                return 'generic'

        print(f"   [Domain Detection] ✅ Detected: {best_domain} (score={best_score})")
        return best_domain

    def extract_aspects(self, text, aspect_keywords):
        """Extract aspects from a single review using keyword matching"""
        aspects_found = []
        text_lower = str(text).lower()
        for aspect, keywords in aspect_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    aspects_found.append(aspect)
                    break
        return list(set(aspects_found))

    def analyze_reviews(self, reviews_df):
        """Main method: detect domain, pick keywords, extract aspects from all reviews"""
        print("\n🔍 Performing Aspect-Based Sentiment Analysis...")

        texts = reviews_df['review_text'].tolist()
        domain = self.detect_domain(texts)
        print(f"   Using keyword set for domain: {domain.upper()}")

        aspect_keywords = self.domain_keywords.get(domain, self.domain_keywords['generic'])
        results = []

        for idx, row in reviews_df.iterrows():
            text = str(row['review_text'])
            aspects = self.extract_aspects(text, aspect_keywords)
            sentiment = row.get('sentiment_label', 'NEUTRAL')
            sentiment_score = float(row.get('sentiment_score', 0.5))

            for aspect in aspects:
                results.append({
                    'review_id':       int(idx),
                    'aspect':          aspect,
                    'domain':          domain,
                    'sentiment':       sentiment,
                    'sentiment_score': sentiment_score,
                    'text_snippet':    text[:100] + '...' if len(text) > 100 else text
                })

        aspect_df = pd.DataFrame(results)
        self.generate_aspect_insights(aspect_df, domain)
        return aspect_df

    def generate_aspect_insights(self, aspect_df, domain='generic'):
        """Print summary and save JSON insights"""
        print("\n📊 ASPECT ANALYSIS RESULTS:")
        print("=" * 50)

        os.makedirs('research/results', exist_ok=True)

        if len(aspect_df) == 0:
            print("No aspects found in reviews")
            with open('research/results/aspect_insights.json', 'w') as f:
                json.dump({'total_aspect_mentions': 0, 'domain': domain,
                           'note': 'No aspects detected'}, f, indent=4)
            return

        aspect_counts = aspect_df['aspect'].value_counts()
        print(f"\n   Domain: {domain.upper()}")
        print(f"   Total mentions: {len(aspect_df)}")
        print("\nTOP DISCUSSED FEATURES:")
        for aspect, count in aspect_counts.head(5).items():
            adf = aspect_df[aspect_df['aspect'] == aspect]
            pos_pct = (adf['sentiment'] == 'POSITIVE').sum() / len(adf) * 100
            print(f"  • {aspect.upper()}: {int(count)} mentions ({pos_pct:.1f}% positive)")

        insights = {
            'domain_detected':       domain,
            'total_aspect_mentions': int(len(aspect_df)),
            'unique_aspects_found':  int(len(aspect_counts)),
            'top_aspect':            str(aspect_counts.index[0]) if len(aspect_counts) > 0 else None,
            'aspect_summary':        {}
        }

        for aspect in aspect_counts.index[:7]:
            adf = aspect_df[aspect_df['aspect'] == aspect]
            if len(adf) > 0:
                pos_pct = float((adf['sentiment'] == 'POSITIVE').sum() / len(adf) * 100)
                insights['aspect_summary'][aspect] = {
                    'mentions':            int(aspect_counts[aspect]),
                    'positive_percentage': round(pos_pct, 1)
                }

        with open('research/results/aspect_insights.json', 'w') as f:
            json.dump(insights, f, indent=4, default=str)
        print(f"\n💾 Saved to research/results/aspect_insights.json")