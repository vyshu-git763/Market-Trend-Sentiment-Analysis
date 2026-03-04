"""
File: trend_analyzer.py
Purpose: Detect sentiment trends over time for business insights
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class TrendAnalyzer:
    def __init__(self):
        pass
    
    def detect_trends(self, analyzed_df):
        """Detect sentiment trends over time"""
        print("\n📈 Analyzing Sentiment Trends Over Time...")
        
        # Ensure date column exists
        if 'review_date' not in analyzed_df.columns:
            print("Error: No date column found")
            return None
        
        # Convert to datetime and extract time periods
        analyzed_df['review_date'] = pd.to_datetime(analyzed_df['review_date'])
        analyzed_df['month'] = analyzed_df['review_date'].dt.to_period('M')
        analyzed_df['quarter'] = analyzed_df['review_date'].dt.to_period('Q')
        analyzed_df['year'] = analyzed_df['review_date'].dt.year
        
        # Monthly trends
        monthly_trends = analyzed_df.groupby('month').agg({
            'sentiment_numeric': 'mean',
            'review_text': 'count'
        }).rename(columns={'review_text': 'review_count'})
        
        # Quarterly trends
        quarterly_trends = analyzed_df.groupby('quarter').agg({
            'sentiment_numeric': 'mean',
            'review_text': 'count'
        }).rename(columns={'review_text': 'review_count'})
        
        # Yearly trends
        yearly_trends = analyzed_df.groupby('year').agg({
            'sentiment_numeric': 'mean',
            'review_text': 'count'
        }).rename(columns={'review_text': 'review_count'})
        
        # Calculate trend direction
        trend_insights = self.calculate_trend_direction(monthly_trends, quarterly_trends, yearly_trends)
        
        # Generate business insights
        self.generate_trend_insights(trend_insights, monthly_trends, quarterly_trends, yearly_trends)
        
        return {
            'monthly': monthly_trends,
            'quarterly': quarterly_trends,
            'yearly': yearly_trends,
            'insights': trend_insights
        }
    
    def calculate_trend_direction(self, monthly, quarterly, yearly):
        """Calculate if sentiment is improving or worsening"""
        insights = {}
        
        # Monthly trend (last 3 months)
        if len(monthly) >= 3:
            recent = monthly['sentiment_numeric'].tail(3)
            if len(recent) == 3:
                slope = self.calculate_slope(recent.values)
                insights['monthly_trend'] = 'improving' if slope > 0.01 else ('declining' if slope < -0.01 else 'stable')
                insights['monthly_slope'] = slope
        
        # Quarterly trend
        if len(quarterly) >= 4:
            q_trend = quarterly['sentiment_numeric'].tail(4)
            if len(q_trend) == 4:
                q_slope = self.calculate_slope(q_trend.values)
                insights['quarterly_trend'] = 'improving' if q_slope > 0.02 else ('declining' if q_slope < -0.02 else 'stable')
                insights['quarterly_slope'] = q_slope
        
        # Yearly trend
        if len(yearly) >= 2:
            y_trend = yearly['sentiment_numeric'].tail(2)
            if len(y_trend) == 2:
                y_change = (y_trend.iloc[1] - y_trend.iloc[0]) / abs(y_trend.iloc[0]) * 100
                insights['yearly_change_pct'] = y_change
                insights['yearly_trend'] = 'improving' if y_change > 5 else ('declining' if y_change < -5 else 'stable')
        
        return insights
    
    def calculate_slope(self, values):
        """Calculate linear slope of values"""
        x = np.arange(len(values))
        slope, _ = np.polyfit(x, values, 1)
        return slope
    
    def generate_trend_insights(self, trend_insights, monthly, quarterly, yearly):
        """Generate business insights from trends"""
        print("\n📊 TREND ANALYSIS RESULTS:")
        print("="*50)
        
        # 1. Overall trend
        if 'monthly_trend' in trend_insights:
            trend = trend_insights['monthly_trend']
            print(f"\n📈 OVERALL SENTIMENT TREND: {trend.upper()}")
            
            if trend == 'improving':
                print("  ✅ Customer satisfaction is IMPROVING")
                print("  → Keep doing what you're doing!")
            elif trend == 'declining':
                print("  ⚠️ Customer satisfaction is DECLINING")
                print("  → Investigate recent changes/issues")
            else:
                print("  ➡️ Customer satisfaction is STABLE")
                print("  → Maintain current quality standards")
        
        # 2. Seasonal patterns
        if len(monthly) >= 12:
            # Find best and worst months
            best_month = monthly['sentiment_numeric'].idxmax()
            worst_month = monthly['sentiment_numeric'].idxmin()
            print(f"\n📅 SEASONAL PATTERNS:")
            print(f"  Best month: {best_month} (Sentiment: {monthly.loc[best_month, 'sentiment_numeric']:.3f})")
            print(f"  Worst month: {worst_month} (Sentiment: {monthly.loc[worst_month, 'sentiment_numeric']:.3f})")
        
        # 3. Business recommendations
        print("\n🎯 BUSINESS RECOMMENDATIONS:")
        
        if 'monthly_trend' in trend_insights:
            if trend_insights['monthly_trend'] == 'declining':
                print("  1. Investigate recent product changes or updates")
                print("  2. Check supply chain/supplier quality")
                print("  3. Review customer service responses")
            elif trend_insights['monthly_trend'] == 'improving':
                print("  1. Highlight positive trends in marketing")
                print("  2. Identify what's working well")
                print("  3. Consider raising prices if value perceived increasing")
        
        # Save trend insights
        trend_insights_serializable = {}
        for key, value in trend_insights.items():
            # Convert numpy/pandas types to Python native types
            if hasattr(value, 'item'):  # numpy types
                trend_insights_serializable[key] = value.item()
            elif isinstance(value, (np.integer, np.floating)):
                trend_insights_serializable[key] = float(value)
            else:
                trend_insights_serializable[key] = value

        import json
        with open('research/results/trend_insights.json', 'w') as f:
            json.dump(trend_insights_serializable, f, indent=4, default=str)