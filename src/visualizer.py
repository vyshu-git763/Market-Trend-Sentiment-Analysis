"""
File: visualizer.py
Purpose: Create charts and visualizations for the paper
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from scipy import stats

class Visualizer:
    def __init__(self, output_dir='research/figures'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
        # Set style
        plt.style.use('seaborn-v0_8-darkgrid')
        sns.set_palette("husl")
    
    def create_sentiment_distribution_chart(self, analyzed_df):
        """Create pie chart of sentiment distribution"""
        print("   Creating sentiment distribution chart...")
        
        # Calculate percentages
        sentiment_counts = analyzed_df['sentiment_label'].value_counts()
        
        # Create figure
        plt.figure(figsize=(10, 6))
        
        # Create subplots
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        # Pie chart
        colors = ['#2ca02c', '#d62728', '#ff7f0e']  # Green, Red, Orange
        ax1.pie(sentiment_counts.values, 
                labels=sentiment_counts.index, 
                colors=colors[:len(sentiment_counts)],
                autopct='%1.1f%%',
                startangle=90,
                explode=[0.05] * len(sentiment_counts))
        ax1.set_title('Sentiment Distribution', fontsize=14, fontweight='bold')
        
        # Bar chart
        ax2.bar(range(len(sentiment_counts)), sentiment_counts.values, 
                color=colors[:len(sentiment_counts)], alpha=0.7)
        ax2.set_xticks(range(len(sentiment_counts)))
        ax2.set_xticklabels(sentiment_counts.index)
        ax2.set_xlabel('Sentiment', fontsize=12)
        ax2.set_ylabel('Count', fontsize=12)
        ax2.set_title('Sentiment Counts', fontsize=14, fontweight='bold')
        
        # Add value labels on bars
        for i, v in enumerate(sentiment_counts.values):
            ax2.text(i, v + 5, str(v), ha='center', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/sentiment_distribution.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"      ✅ Saved: sentiment_distribution.png")
        return True
    
    def create_rating_vs_sentiment_chart(self, analyzed_df):
        """Create chart comparing ratings with sentiment"""
        print("   Creating rating vs sentiment chart...")
        
        # Group by rating
        rating_sentiment = analyzed_df.groupby('rating').agg({
            'sentiment_numeric': 'mean',
            'review_text': 'count'
        }).rename(columns={'review_text': 'count'})
        
        # Create bar chart
        x_pos = np.arange(len(rating_sentiment))
        
        fig, ax1 = plt.subplots(figsize=(12, 6))
        
        # Bar chart for count
        bars = ax1.bar(x_pos, rating_sentiment['count'], 
                      color='skyblue', alpha=0.7, label='Number of Reviews')
        ax1.set_xlabel('Rating (1-5 stars)', fontsize=12)
        ax1.set_ylabel('Number of Reviews', fontsize=12, color='blue')
        ax1.tick_params(axis='y', labelcolor='blue')
        
        # Line chart for sentiment
        ax2 = ax1.twinx()
        ax2.plot(x_pos, rating_sentiment['sentiment_numeric'], 
                color='red', marker='o', linewidth=2, markersize=8, label='Avg Sentiment')
        ax2.set_ylabel('Average Sentiment Score', fontsize=12, color='red')
        ax2.tick_params(axis='y', labelcolor='red')
        ax2.axhline(y=0, color='gray', linestyle='--', alpha=0.5)
        
        # Set x-ticks
        ax1.set_xticks(x_pos)
        ax1.set_xticklabels([f'{i+1}★' for i in range(len(rating_sentiment))])
        
        # Title
        plt.title('Rating vs Sentiment Analysis', fontsize=14, fontweight='bold')
        
        # Add legend
        lines1, labels1 = ax1.get_legend_handles_labels()
        lines2, labels2 = ax2.get_legend_handles_labels()
        ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
        
        # Add count labels on bars
        for i, bar in enumerate(bars):
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height + 5,
                    f'{int(height)}', ha='center', va='bottom', fontsize=9)
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/rating_vs_sentiment.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"      ✅ Saved: rating_vs_sentiment.png")
        return True
    
    def create_sentiment_price_trend(self):
        """Create combined sentiment and price trend chart"""
        print("   Creating sentiment-price trend chart...")
        
        try:
            # Load market data - USE YOUR ALIGNED FILE
            market_df = pd.read_csv('data/processed/market_data_aligned.csv')
            market_df['date'] = pd.to_datetime(market_df['date'])
            
            # Load daily sentiment
            daily_sentiment = pd.read_csv('data/processed/daily_sentiment.csv')
            
            # Fix date column in sentiment data
            if 'date' not in daily_sentiment.columns:
                daily_sentiment['date'] = pd.to_datetime(daily_sentiment.index)
            else:
                daily_sentiment['date'] = pd.to_datetime(daily_sentiment['date'])
            
            # Merge data on date
            merged = pd.merge(market_df, daily_sentiment, 
                            on='date', how='inner')
            
            if len(merged) < 10:
                print(f"      ⚠️ Not enough overlapping data: {len(merged)} points")
                return False
            
            print(f"      ✅ Merged {len(merged)} data points")
            
            # Create figure with 2 subplots
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10), sharex=True)
            
            # Plot 1: Stock Price
            ax1.plot(merged['date'], merged['stock_price'], 'b-', linewidth=2, label='Stock Price')
            ax1.set_ylabel('Stock Price ($)', fontsize=12)
            ax1.set_title('Stock Price and Sentiment Over Time', fontsize=16, fontweight='bold')
            ax1.grid(True, alpha=0.3)
            ax1.legend(loc='upper left')
            
            # Plot 2: Sentiment
            ax2.plot(merged['date'], merged['sentiment_score'], 'r-', linewidth=2, label='Sentiment Score')
            ax2.axhline(y=0, color='k', linestyle='--', alpha=0.5, label='Neutral')
            ax2.set_xlabel('Date', fontsize=12)
            ax2.set_ylabel('Sentiment Score', fontsize=12)
            ax2.grid(True, alpha=0.3)
            ax2.legend(loc='upper left')
            
            # Format x-axis
            plt.xticks(rotation=45)
            plt.tight_layout()
            
            plt.savefig(f'{self.output_dir}/sentiment_price_trend.png', dpi=300, bbox_inches='tight')
            plt.close()
            
            print(f"      ✅ Saved: sentiment_price_trend.png")
            return True
            
        except Exception as e:
            print(f"      ❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def create_correlation_scatter(self):
        """Create correlation scatter plot between sentiment and price"""
        print("   Creating correlation scatter plot...")
        
        try:
            # Load market data
            market_df = pd.read_csv('data/processed/market_data_aligned.csv')
            market_df['date'] = pd.to_datetime(market_df['date'])
            
            # Load daily sentiment
            daily_sentiment = pd.read_csv('data/processed/daily_sentiment.csv')
            
            # Fix date column in sentiment data
            if 'date' not in daily_sentiment.columns:
                daily_sentiment['date'] = pd.to_datetime(daily_sentiment.index)
            else:
                daily_sentiment['date'] = pd.to_datetime(daily_sentiment['date'])
            
            # Merge data on date (not on index)
            merged_data = pd.merge(market_df, daily_sentiment, 
                                  on='date', how='inner')
            
            if len(merged_data) < 10:
                print(f"      ⚠️ Not enough overlapping data: {len(merged_data)} points")
                return False
            
            print(f"      ✅ Using {len(merged_data)} data points for correlation")
            
            plt.figure(figsize=(12, 8))
            
            # Create scatter plot - use sentiment_score for color
            scatter = plt.scatter(merged_data['sentiment_score'], 
                                 merged_data['stock_price'],
                                 c=merged_data['sentiment_score'],  # Changed from sentiment_confidence
                                 cmap='RdYlGn',
                                 s=100,
                                 alpha=0.6,
                                 edgecolors='black',
                                 linewidth=0.5)
            
            # Add colorbar
            plt.colorbar(scatter, label='Sentiment Score')
            
            # Calculate correlation
            slope, intercept, r_value, p_value, std_err = stats.linregress(
                merged_data['sentiment_score'], 
                merged_data['stock_price']
            )
            
            # Plot regression line
            x_line = np.array([merged_data['sentiment_score'].min(), 
                              merged_data['sentiment_score'].max()])
            y_line = slope * x_line + intercept
            plt.plot(x_line, y_line, 'r-', linewidth=2, 
                    label=f'Correlation: r = {r_value:.3f}\np-value: {p_value:.4f}')
            
            # Labels and title
            plt.xlabel('Sentiment Score', fontsize=12)
            plt.ylabel('Stock Price ($)', fontsize=12)
            plt.title('Sentiment vs Stock Price Correlation', fontsize=14, fontweight='bold')
            plt.legend()
            plt.grid(True, alpha=0.3)
            
            # Add correlation stats as text
            stats_text = f'n = {len(merged_data)}\nR² = {r_value**2:.3f}'
            plt.text(0.05, 0.95, stats_text, transform=plt.gca().transAxes,
                    fontsize=10, verticalalignment='top',
                    bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
            
            plt.tight_layout()
            plt.savefig(f'{self.output_dir}/correlation_scatter.png', dpi=300, bbox_inches='tight')
            plt.close()
            
            print(f"      ✅ Saved: correlation_scatter.png")
            return True
            
        except Exception as e:
            print(f"      ❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def create_review_statistics(self, analyzed_df):
        """Create review statistics charts"""
        print("   Creating review statistics charts...")
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        
        # Chart 1: Rating distribution
        rating_counts = analyzed_df['rating'].value_counts().sort_index()
        colors = ['#d62728', '#ff9896', '#c5b0d5', '#98df8a', '#2ca02c']
        axes[0, 0].bar(rating_counts.index.astype(str), rating_counts.values, 
                      color=colors, alpha=0.7)
        axes[0, 0].set_title('Rating Distribution', fontsize=12, fontweight='bold')
        axes[0, 0].set_xlabel('Rating (Stars)', fontsize=10)
        axes[0, 0].set_ylabel('Count', fontsize=10)
        axes[0, 0].grid(True, alpha=0.3)
        
        # Add value labels
        for i, v in enumerate(rating_counts.values):
            axes[0, 0].text(i, v + 5, str(v), ha='center', fontsize=9)
        
        # Chart 2: Text length distribution
        analyzed_df['text_length'] = analyzed_df['review_text'].str.len()
        axes[0, 1].hist(analyzed_df['text_length'], bins=30, color='skyblue', alpha=0.7)
        axes[0, 1].set_title('Review Text Length Distribution', fontsize=12, fontweight='bold')
        axes[0, 1].set_xlabel('Text Length (characters)', fontsize=10)
        axes[0, 1].set_ylabel('Frequency', fontsize=10)
        axes[0, 1].grid(True, alpha=0.3)
        
        # Chart 3: Sentiment by rating
        sentiment_by_rating = analyzed_df.groupby('rating')['sentiment_numeric'].mean()
        colors_bar = ['red' if x < 0 else 'green' for x in sentiment_by_rating.values]
        axes[1, 0].bar(sentiment_by_rating.index.astype(str), 
                      sentiment_by_rating.values, 
                      color=colors_bar, alpha=0.7)
        axes[1, 0].axhline(y=0, color='gray', linestyle='--', alpha=0.5)
        axes[1, 0].set_title('Average Sentiment by Rating', fontsize=12, fontweight='bold')
        axes[1, 0].set_xlabel('Rating', fontsize=10)
        axes[1, 0].set_ylabel('Avg Sentiment Score', fontsize=10)
        axes[1, 0].grid(True, alpha=0.3)
        
        # Add value labels
        for i, v in enumerate(sentiment_by_rating.values):
            axes[1, 0].text(i, v + 0.01 * (1 if v >= 0 else -1), 
                           f'{v:.3f}', ha='center', fontsize=9)
        
        # Chart 4: Confidence distribution
        axes[1, 1].hist(analyzed_df['sentiment_score'], bins=30, color='orange', alpha=0.7)
        axes[1, 1].set_title('Sentiment Confidence Distribution', fontsize=12, fontweight='bold')
        axes[1, 1].set_xlabel('Confidence Score', fontsize=10)
        axes[1, 1].set_ylabel('Frequency', fontsize=10)
        axes[1, 1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/review_statistics.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"      ✅ Saved: review_statistics.png")
        return True
    
    def create_metrics_summary(self, results_file='research/results/initial_results.json'):
        """Create summary table of key metrics"""
        print("   Creating metrics summary...")
        
        try:
            import json
            with open(results_file, 'r') as f:
                results = json.load(f)
            
            # Create figure
            plt.figure(figsize=(12, 8))
            plt.axis('off')
            
            # Create table data
            table_data = [
                ['Metric', 'Value', 'Description'],
                ['Reviews Analyzed', f"{results['total_reviews_analyzed']:,}", 'Total reviews processed'],
                ['Positive Sentiment', f"{results['positive_sentiment_pct']}%", 'Percentage of positive reviews'],
                ['Negative Sentiment', f"{results['negative_sentiment_pct']}%", 'Percentage of negative reviews'],
                ['Accuracy vs Ratings', f"{results['accuracy_vs_ratings']}%", 'AI vs human rating agreement'],
                ['Average Confidence', f"{results['average_confidence']}%", 'Model confidence in predictions'],
                ['Average Rating', f"{results['average_rating']}", 'Average user rating (1-5)'],
                ['Sentiment Days', f"{results['sentiment_days_created']}", 'Days of sentiment data created']
            ]
            
            # Create table
            table = plt.table(cellText=table_data,
                             cellLoc='left',
                             loc='center',
                             colWidths=[0.25, 0.15, 0.5])
            
            # Style table
            table.auto_set_font_size(False)
            table.set_fontsize(10)
            table.scale(1.2, 1.8)
            
            # Style header row
            for i in range(3):
                table[(0, i)].set_facecolor('#4C72B0')
                table[(0, i)].set_text_props(weight='bold', color='white')
            
            # Style alternating rows
            for i in range(1, len(table_data)):
                color = '#F0F0F0' if i % 2 == 0 else '#FFFFFF'
                for j in range(3):
                    table[(i, j)].set_facecolor(color)
            
            plt.title('Market Sentiment Analysis - Key Metrics', 
                     fontsize=16, fontweight='bold', y=0.98)
            
            plt.tight_layout()
            plt.savefig(f'{self.output_dir}/metrics_summary.png', dpi=300, bbox_inches='tight')
            plt.close()
            
            print(f"      ✅ Saved: metrics_summary.png")
            return True
            
        except Exception as e:
            print(f"      ❌ Error creating metrics summary: {e}")
            return False

# Test the visualizer
if __name__ == "__main__":
    print("Testing Visualizer...")
    print("="*50)
    
    # Load data
    analyzed_df = pd.read_csv('data/processed/analyzed_reviews.csv', nrows=1000)
    
    # Initialize visualizer
    visualizer = Visualizer()
    
    # Create ALL charts for paper
    print("\nCreating visualizations for research paper:")
    print("-"*50)
    
    visualizer.create_sentiment_distribution_chart(analyzed_df)
    visualizer.create_rating_vs_sentiment_chart(analyzed_df)
    visualizer.create_sentiment_price_trend()
    visualizer.create_correlation_scatter()
    visualizer.create_review_statistics(analyzed_df)
    visualizer.create_metrics_summary()
    
    print("\n" + "="*50)
    print("✅ ALL VISUALIZATIONS CREATED!")
    print("="*50)
    print("\nCharts saved to research/figures/:")
    print("1. sentiment_distribution.png")
    print("2. rating_vs_sentiment.png")
    print("3. sentiment_price_trend.png")
    print("4. correlation_scatter.png")
    print("5. review_statistics.png")
    print("6. metrics_summary.png")
    print("7. daily_sentiment_trend.png")
    print("\nThese are ready for your research paper!")