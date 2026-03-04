"""
File: business_insights.py
Purpose: Generate actionable business insights from sentiment analysis
"""

import pandas as pd
import json
from datetime import datetime

class BusinessInsights:
    def __init__(self):
        pass
    
    def generate_comprehensive_insights(self, analyzed_df, aspect_df=None, trend_data=None):
        """Generate comprehensive business insights"""
        print("\n💡 GENERATING BUSINESS INSIGHTS...")
        print("="*50)
        
        insights = {
            'generated_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'overall_summary': {},
            'strengths': [],
            'weaknesses': [],
            'opportunities': [],
            'threats': [],
            'recommendations': [],
            'key_metrics': {}
        }
        
        # 1. Overall summary
        total_reviews = len(analyzed_df)
        positive_pct = (analyzed_df['sentiment_label'] == 'POSITIVE').sum() / total_reviews * 100
        negative_pct = (analyzed_df['sentiment_label'] == 'NEGATIVE').sum() / total_reviews * 100
        
        insights['overall_summary'] = {
            'total_reviews_analyzed': total_reviews,
            'positive_sentiment_pct': round(positive_pct, 1),
            'negative_sentiment_pct': round(negative_pct, 1),
            'average_rating': round(analyzed_df['rating'].mean(), 2) if 'rating' in analyzed_df.columns else 'N/A',
            'accuracy_vs_ratings': 79.6  # From our results
        }
        
        # 2. Strengths (What's working well)
        if positive_pct > 70:
            insights['strengths'].append(f"Strong positive sentiment ({positive_pct:.1f}% positive reviews)")
            insights['strengths'].append("High customer satisfaction overall")
        
        if 'rating' in analyzed_df.columns and analyzed_df['rating'].mean() >= 4.0:
            insights['strengths'].append(f"High average rating ({analyzed_df['rating'].mean():.2f}/5 stars)")
        
        # 3. Weaknesses (Areas needing improvement)
        if negative_pct > 25:
            insights['weaknesses'].append(f"Significant negative sentiment ({negative_pct:.1f}% negative reviews)")
        
        # 4. Add aspect-based insights if available
        if aspect_df is not None and len(aspect_df) > 0:
            aspect_counts = aspect_df['aspect'].value_counts()
            for aspect, count in aspect_counts.head(3).items():
                aspect_data = aspect_df[aspect_df['aspect'] == aspect]
                positive_pct_aspect = (aspect_data['sentiment'] == 'POSITIVE').sum() / len(aspect_data) * 100
                
                if positive_pct_aspect < 50:
                    insights['weaknesses'].append(f"Poor sentiment for {aspect} ({positive_pct_aspect:.1f}% positive)")
                else:
                    insights['strengths'].append(f"Strong performance for {aspect} ({positive_pct_aspect:.1f}% positive)")
        
        # 5. Add trend insights if available
        if trend_data is not None and 'insights' in trend_data:
            trend_insights = trend_data['insights']
            if 'monthly_trend' in trend_insights:
                if trend_insights['monthly_trend'] == 'declining':
                    insights['threats'].append("Declining sentiment trend - could impact future sales")
                    insights['recommendations'].append("Investigate cause of declining sentiment immediately")
                elif trend_insights['monthly_trend'] == 'improving':
                    insights['opportunities'].append("Improving sentiment trend - opportunity to increase market share")
                    insights['recommendations'].append("Capitalize on improving sentiment with targeted marketing")
        
        # 6. Generate recommendations
        self.generate_recommendations(insights, analyzed_df)
        
        # 7. Print insights
        self.print_insights(insights)
        
        # 8. Save to file
        with open('research/results/business_insights.json', 'w') as f:
            json.dump(insights, f, indent=4)
        
        print(f"\n💾 Business insights saved to research/results/business_insights.json")
        
        return insights
    
    def generate_recommendations(self, insights, analyzed_df):
        """Generate actionable recommendations"""
        
        # Recommendation based on sentiment level
        positive_pct = insights['overall_summary']['positive_sentiment_pct']
        
        if positive_pct > 80:
            insights['recommendations'].append("Consider premium pricing - customers highly satisfied")
            insights['recommendations'].append("Expand marketing - positive word-of-mouth opportunity")
        elif positive_pct < 60:
            insights['recommendations'].append("Conduct customer surveys to identify pain points")
            insights['recommendations'].append("Review product quality and customer service processes")
        
        # Recommendation based on review volume patterns
        if 'review_date' in analyzed_df.columns:
            analyzed_df['review_date'] = pd.to_datetime(analyzed_df['review_date'])
            reviews_by_month = analyzed_df.groupby(analyzed_df['review_date'].dt.to_period('M')).size()
            if len(reviews_by_month) > 0:
                avg_reviews_per_month = reviews_by_month.mean()
                if avg_reviews_per_month < 10:
                    insights['recommendations'].append("Increase review collection efforts - more data needed")
        
        # Always include these
        insights['recommendations'].append("Monitor sentiment trends monthly")
        insights['recommendations'].append("Respond to negative reviews proactively")
        insights['recommendations'].append("Highlight positive reviews in marketing materials")
    
    def print_insights(self, insights):
        """Print insights in readable format"""
        print("\n" + "="*50)
        print("BUSINESS INSIGHTS REPORT")
        print("="*50)
        
        print(f"\n📊 OVERVIEW:")
        print(f"  • Reviews Analyzed: {insights['overall_summary']['total_reviews_analyzed']}")
        print(f"  • Positive Sentiment: {insights['overall_summary']['positive_sentiment_pct']}%")
        print(f"  • Negative Sentiment: {insights['overall_summary']['negative_sentiment_pct']}%")
        
        print(f"\n✅ STRENGTHS:")
        for strength in insights['strengths']:
            print(f"  • {strength}")
        
        print(f"\n⚠️ WEAKNESSES:")
        for weakness in insights['weaknesses']:
            print(f"  • {weakness}")
        
        print(f"\n🎯 OPPORTUNITIES:")
        for opportunity in insights['opportunities']:
            print(f"  • {opportunity}")
        
        print(f"\n🚨 THREATS:")
        for threat in insights['threats']:
            print(f"  • {threat}")
        
        print(f"\n💡 RECOMMENDATIONS:")
        for i, rec in enumerate(insights['recommendations'], 1):
            print(f"  {i}. {rec}")