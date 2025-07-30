"""
Example usage of the user_behavior_analysis package.

This script demonstrates how to use the package to analyze user behavior data.
"""

import sys
from pathlib import Path

# Add the package to the Python path for local testing
sys.path.insert(0, str(Path(__file__).parent))

from user_behavior_analysis import UserBehaviorAnalyzer, UserBehaviorVisualizer, AnalysisConfig


def main():
    """Main example function."""
    
    # Path to the sample data file
    data_file = Path(__file__).parent / "user_behavior_data.csv"
    
    if not data_file.exists():
        print(f"Sample data file not found: {data_file}")
        print("Please ensure user_behavior_data.csv exists in the same directory.")
        return
    
    print("User Behavior Analysis Example")
    print("=" * 40)
    
    # 1. Create custom configuration (optional)
    config = AnalysisConfig(
        high_engagement_pages=6,
        high_engagement_time_minutes=20.0,
        remove_duplicates=True
    )
    
    # 2. Initialize analyzer with custom config
    analyzer = UserBehaviorAnalyzer(config)
    print(f"Initialized analyzer with custom config")
    
    # 3. Load and preprocess data
    print(f"Loading data from: {data_file}")
    data = analyzer.load_and_preprocess(data_file)
    print(f"Loaded {len(data)} records")
    
    # 4. Get data information
    data_info = analyzer.get_data_info()
    print(f"Data shape: {data_info['original_shape']}")
    print(f"Date range: {data_info['date_range']['start']} to {data_info['date_range']['end']}")
    
    # 5. Run individual analyses
    print("\nRunning individual analyses...")
    
    # Engagement analysis
    engagement = analyzer.engagement_analysis()
    print(f"High engagement users: {engagement['high_engagement_users']} "
          f"({engagement['high_engagement_percentage']:.1f}%)")
    
    # Device analysis
    device_stats = analyzer.device_analysis()
    print(f"Device types analyzed: {len(device_stats)}")
    print("Top device by conversion rate:")
    top_device = device_stats.loc[device_stats['conversion_rate'].idxmax()]
    print(f"  {top_device['device_type']}: {top_device['conversion_rate']:.2%}")
    
    # Temporal analysis
    temporal = analyzer.temporal_analysis()
    print(f"Peak hours: {temporal['peak_hours']}")
    print(f"Peak hours conversion rate: {temporal['peak_hours_stats']['conversion_rate']:.2%}")
    
    # 6. Run comprehensive analysis
    print("\nRunning comprehensive analysis...")
    results = analyzer.comprehensive_analysis()
    
    # Display summary statistics
    summary = results['summary_stats']
    print(f"Summary Statistics:")
    print(f"  Total users: {summary['total_users']}")
    print(f"  Total sessions: {summary['total_sessions']}")
    print(f"  Overall conversion rate: {summary['overall_conversion_rate']:.2%}")
    print(f"  Average session duration: {summary['avg_session_duration']:.1f} minutes")
    print(f"  Average pages per session: {summary['avg_pages_per_session']:.1f}")
    
    # Display key insights
    insights = results['key_insights']
    print(f"\nKey Insights:")
    print(f"  Best performing device: {insights['best_performing_device']}")
    print(f"  Worst performing device: {insights['worst_performing_device']}")
    print(f"  Best performing country: {insights['best_performing_country']}")
    print(f"  Best performing referrer: {insights['best_performing_referrer']}")
    
    # 7. Create visualizations
    print("\nCreating visualizations...")
    visualizer = UserBehaviorVisualizer(config)
    
    # Create individual plots
    print("  Creating device distribution plot...")
    device_fig = visualizer.plot_device_distribution(data, show_plot=False)
    
    print("  Creating conversion by device plot...")
    conversion_fig = visualizer.plot_conversion_by_device(data, show_plot=False)
    
    print("  Creating temporal trends plot...")
    temporal_fig = visualizer.plot_temporal_trends(
        temporal['hourly_patterns'], show_plot=False
    )
    
    # Create complete dashboard
    print("  Creating complete dashboard...")
    figures = visualizer.create_dashboard(analyzer, show_plot=False)
    print(f"  Created {len(figures)} dashboard plots")
    
    # Save plots (optional)
    save_plots = input("\nSave plots to 'plots' directory? (y/n): ").lower().strip()
    if save_plots == 'y':
        visualizer.save_dashboard(figures, output_dir='plots')
        print("Plots saved to 'plots' directory")
    
    # Clean up matplotlib figures
    visualizer.close_all_figures()
    
    print("\nAnalysis complete!")


if __name__ == "__main__":
    try:
        main()
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Make sure the data file exists and is accessible.")
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please check your data format and try again.")