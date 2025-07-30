#!/usr/bin/env python3
"""
Quick test script to verify the package works correctly.
"""

import pandas as pd
import numpy as np
from user_behavior_analysis import UserBehaviorAnalyzer, UserBehaviorVisualizer, AnalysisConfig

def create_sample_data():
    """Create sample data for testing."""
    np.random.seed(42)
    n_samples = 200
    
    data = {
        'user_id': [f'user{i}' for i in range(n_samples)],
        'timestamp': pd.date_range('2023-01-01', periods=n_samples, freq='h'),
        'page_views': np.random.randint(1, 15, n_samples),
        'time_spent_minutes': np.random.uniform(5, 60, n_samples),
        'conversion': np.random.choice([0, 1], n_samples, p=[0.75, 0.25]),
        'device_type': np.random.choice(['mobile', 'desktop', 'tablet'], n_samples),
        'referrer_type': np.random.choice(['social', 'direct', 'search', 'email'], n_samples),
        'country': np.random.choice(['US', 'UK', 'CA', 'AU', 'DE'], n_samples),
        'bounce_rate': np.random.uniform(0, 1, n_samples)
    }
    return pd.DataFrame(data)

def main():
    print("Testing User Behavior Analysis Package")
    print("=" * 40)
    
    # Create sample data
    print("Creating sample data...")
    df = create_sample_data()
    print(f"Created {len(df)} sample records")
    
    # Initialize analyzer
    config = AnalysisConfig(high_engagement_pages=7, high_engagement_time_minutes=25.0)
    analyzer = UserBehaviorAnalyzer(config)
    
    # Set data
    analyzer.set_data(df)
    print("Data loaded and preprocessed")
    
    # Run comprehensive analysis
    print("\nRunning comprehensive analysis...")
    results = analyzer.comprehensive_analysis()
    
    # Display results
    summary = results['summary_stats']
    print(f"\nSummary Statistics:")
    print(f"  Total users: {summary['total_users']}")
    print(f"  Total sessions: {summary['total_sessions']}")
    print(f"  Overall conversion rate: {summary['overall_conversion_rate']:.2%}")
    print(f"  Average session duration: {summary['avg_session_duration']:.1f} minutes")
    
    engagement = results['engagement_analysis']
    print(f"\nEngagement Analysis:")
    print(f"  High engagement users: {engagement['high_engagement_users']} ({engagement['high_engagement_percentage']:.1f}%)")
    print(f"  Average page views: {engagement['avg_page_views']:.1f}")
    
    insights = results['key_insights']
    print(f"\nKey Insights:")
    print(f"  Best performing device: {insights['best_performing_device']}")
    print(f"  Best performing country: {insights['best_performing_country']}")
    
    # Test visualization
    print("\nTesting visualization...")
    visualizer = UserBehaviorVisualizer(config)
    
    # Create a simple plot (no display)
    fig = visualizer.plot_device_distribution(df, show_plot=False)
    print(f"Created device distribution plot with {len(fig.axes)} axes")
    
    # Create dashboard
    figures = visualizer.create_dashboard(analyzer, show_plot=False)
    print(f"Created dashboard with {len(figures)} plots")
    
    # Clean up
    visualizer.close_all_figures()
    
    print("\n✅ Package test completed successfully!")
    print("The user_behavior_analysis package is working correctly.")

if __name__ == "__main__":
    main()