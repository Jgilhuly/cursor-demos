"""
Visualization module for user behavior analysis.

Contains plotting functions for various analysis results.
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from typing import Optional, Dict, Tuple, List

from .config import AnalysisConfig, DEFAULT_CONFIG


class UserBehaviorVisualizer:
    """
    Class for creating visualizations of user behavior analysis results.
    """
    
    def __init__(self, config: Optional[AnalysisConfig] = None):
        """
        Initialize the visualizer.
        
        Args:
            config: Configuration object with visualization settings
        """
        self.config = config or DEFAULT_CONFIG
        
        # Set seaborn style
        sns.set_style("whitegrid")
        plt.style.use('default')
    
    def plot_device_distribution(self, df: pd.DataFrame, show_plot: bool = True) -> plt.Figure:
        """
        Plot device type distribution.
        
        Args:
            df: DataFrame with device_type column
            show_plot: Whether to display the plot
            
        Returns:
            matplotlib.figure.Figure: The figure object
        """
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=self.config.figure_size_default)
        
        # Bar chart
        device_counts = df['device_type'].value_counts()
        ax1.bar(device_counts.index, device_counts.values)
        ax1.set_title('Device Type Distribution')
        ax1.set_xlabel('Device Type')
        ax1.set_ylabel('Count')
        ax1.tick_params(axis='x', rotation=45)
        
        # Pie chart  
        ax2.pie(device_counts.values, labels=device_counts.index, autopct='%1.1f%%')
        ax2.set_title('Device Type Distribution')
        
        plt.tight_layout()
        
        if show_plot:
            plt.show()
            
        return fig
    
    def plot_referrer_distribution(self, df: pd.DataFrame, show_plot: bool = True) -> plt.Figure:
        """
        Plot referrer type distribution.
        
        Args:
            df: DataFrame with referrer_type column
            show_plot: Whether to display the plot
            
        Returns:
            matplotlib.figure.Figure: The figure object
        """
        fig, ax = plt.subplots(figsize=self.config.figure_size_default)
        
        referrer_counts = df['referrer_type'].value_counts()
        ax.pie(referrer_counts.values, labels=referrer_counts.index, autopct='%1.1f%%')
        ax.set_title('Referrer Type Distribution')
        
        if show_plot:
            plt.show()
            
        return fig
    
    def plot_conversion_by_device(self, df: pd.DataFrame, show_plot: bool = True) -> plt.Figure:
        """
        Plot conversion rates by device type.
        
        Args:
            df: DataFrame with device_type and conversion columns
            show_plot: Whether to display the plot
            
        Returns:
            matplotlib.figure.Figure: The figure object
        """
        fig, ax = plt.subplots(figsize=self.config.figure_size_default)
        
        device_conversion = df.groupby('device_type')['conversion'].mean()
        bars = ax.bar(device_conversion.index, device_conversion.values)
        
        ax.set_title('Conversion Rate by Device Type')
        ax.set_xlabel('Device Type')
        ax.set_ylabel('Conversion Rate')
        ax.tick_params(axis='x', rotation=45)
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{height:.2%}', ha='center', va='bottom')
        
        if show_plot:
            plt.show()
            
        return fig
    
    def plot_temporal_trends(self, hourly_data: pd.DataFrame, show_plot: bool = True) -> plt.Figure:
        """
        Plot hourly trends for page views, time spent, and conversion.
        
        Args:
            hourly_data: DataFrame with hourly aggregated data
            show_plot: Whether to display the plot
            
        Returns:
            matplotlib.figure.Figure: The figure object
        """
        fig, axes = plt.subplots(2, 2, figsize=self.config.figure_size_large)
        
        # Page views
        axes[0, 0].plot(hourly_data.index, hourly_data['page_views'], marker='o')
        axes[0, 0].set_title('Avg Page Views by Hour')
        axes[0, 0].set_xlabel('Hour of Day')
        axes[0, 0].set_ylabel('Page Views')
        axes[0, 0].grid(True)
        
        # Time spent
        axes[0, 1].plot(hourly_data.index, hourly_data['time_spent_minutes'], marker='o', color='orange')
        axes[0, 1].set_title('Avg Time Spent by Hour')
        axes[0, 1].set_xlabel('Hour of Day')
        axes[0, 1].set_ylabel('Time (minutes)')
        axes[0, 1].grid(True)
        
        # Conversion rate
        axes[1, 0].plot(hourly_data.index, hourly_data['conversion'], marker='o', color='green')
        axes[1, 0].set_title('Conversion Rate by Hour')
        axes[1, 0].set_xlabel('Hour of Day')
        axes[1, 0].set_ylabel('Conversion Rate')
        axes[1, 0].grid(True)
        
        # User count
        axes[1, 1].bar(hourly_data.index, hourly_data['user_id'])
        axes[1, 1].set_title('Sessions by Hour')
        axes[1, 1].set_xlabel('Hour of Day')
        axes[1, 1].set_ylabel('Session Count')
        
        plt.tight_layout()
        
        if show_plot:
            plt.show()
            
        return fig
    
    def plot_geographic_analysis(self, country_data: pd.DataFrame, show_plot: bool = True) -> plt.Figure:
        """
        Plot geographic analysis results.
        
        Args:
            country_data: DataFrame with country analysis results
            show_plot: Whether to display the plot
            
        Returns:
            matplotlib.figure.Figure: The figure object
        """
        fig, axes = plt.subplots(1, 2, figsize=self.config.figure_size_default)
        
        # Top countries by conversion rate
        top_countries = country_data.nlargest(10, 'conversion_rate')
        
        axes[0].barh(top_countries['country'], top_countries['conversion_rate'])
        axes[0].set_title('Conversion Rate by Country (Top 10)')
        axes[0].set_xlabel('Conversion Rate')
        
        # User count by country
        axes[1].barh(top_countries['country'], top_countries['user_count'])
        axes[1].set_title('User Count by Country (Top 10)')
        axes[1].set_xlabel('User Count')
        
        plt.tight_layout()
        
        if show_plot:
            plt.show()
            
        return fig
    
    def plot_referrer_analysis(self, referrer_data: pd.DataFrame, show_plot: bool = True) -> plt.Figure:
        """
        Plot referrer performance analysis.
        
        Args:
            referrer_data: DataFrame with referrer analysis results
            show_plot: Whether to display the plot
            
        Returns:
            matplotlib.figure.Figure: The figure object
        """
        fig, axes = plt.subplots(2, 3, figsize=self.config.figure_size_large)
        
        # Conversion rate
        axes[0, 0].bar(referrer_data['referrer_type'], referrer_data['conv_rate'])
        axes[0, 0].set_title('Conversion Rate by Referrer')
        axes[0, 0].tick_params(axis='x', rotation=45)
        axes[0, 0].set_ylabel('Conversion Rate')
        
        # Average page views
        axes[0, 1].bar(referrer_data['referrer_type'], referrer_data['avg_pages'])
        axes[0, 1].set_title('Avg Page Views by Referrer')
        axes[0, 1].tick_params(axis='x', rotation=45)
        axes[0, 1].set_ylabel('Page Views')
        
        # Bounce rate
        axes[0, 2].bar(referrer_data['referrer_type'], referrer_data['bounce'])
        axes[0, 2].set_title('Bounce Rate by Referrer')
        axes[0, 2].tick_params(axis='x', rotation=45)
        axes[0, 2].set_ylabel('Bounce Rate')
        
        # Engagement score
        axes[1, 0].bar(referrer_data['referrer_type'], referrer_data['engagement_score'])
        axes[1, 0].set_title('Engagement Score by Referrer')
        axes[1, 0].tick_params(axis='x', rotation=45)
        axes[1, 0].set_ylabel('Engagement Score')
        
        # Average time spent
        axes[1, 1].bar(referrer_data['referrer_type'], referrer_data['avg_time'])
        axes[1, 1].set_title('Avg Time Spent by Referrer')
        axes[1, 1].tick_params(axis='x', rotation=45)
        axes[1, 1].set_ylabel('Time (minutes)')
        
        # User count
        axes[1, 2].bar(referrer_data['referrer_type'], referrer_data['users'])
        axes[1, 2].set_title('User Count by Referrer')
        axes[1, 2].tick_params(axis='x', rotation=45)
        axes[1, 2].set_ylabel('Users')
        
        plt.tight_layout()
        
        if show_plot:
            plt.show()
            
        return fig
    
    def plot_engagement_distribution(self, df: pd.DataFrame, show_plot: bool = True) -> plt.Figure:
        """
        Plot engagement metrics distribution.
        
        Args:
            df: DataFrame with engagement data
            show_plot: Whether to display the plot
            
        Returns:
            matplotlib.figure.Figure: The figure object
        """
        fig, axes = plt.subplots(2, 2, figsize=self.config.figure_size_default)
        
        # Page views histogram
        axes[0, 0].hist(df['page_views'], bins=20, alpha=0.7, edgecolor='black')
        axes[0, 0].set_title('Page Views Distribution')
        axes[0, 0].set_xlabel('Page Views')
        axes[0, 0].set_ylabel('Frequency')
        
        # Time spent histogram
        axes[0, 1].hist(df['time_spent_minutes'], bins=20, alpha=0.7, edgecolor='black', color='orange')
        axes[0, 1].set_title('Time Spent Distribution')
        axes[0, 1].set_xlabel('Time (minutes)')
        axes[0, 1].set_ylabel('Frequency')
        
        # Bounce rate histogram
        axes[1, 0].hist(df['bounce_rate'], bins=20, alpha=0.7, edgecolor='black', color='red')
        axes[1, 0].set_title('Bounce Rate Distribution')
        axes[1, 0].set_xlabel('Bounce Rate')
        axes[1, 0].set_ylabel('Frequency')
        
        # Conversion scatter plot
        axes[1, 1].scatter(df['page_views'], df['time_spent_minutes'], 
                          c=df['conversion'], alpha=0.6, cmap='coolwarm')
        axes[1, 1].set_title('Page Views vs Time Spent (by Conversion)')
        axes[1, 1].set_xlabel('Page Views')
        axes[1, 1].set_ylabel('Time Spent (minutes)')
        
        plt.tight_layout()
        
        if show_plot:
            plt.show()
            
        return fig
    
    def create_dashboard(self, analyzer, show_plot: bool = True) -> Dict[str, plt.Figure]:
        """
        Create a comprehensive dashboard with all visualizations.
        
        Args:
            analyzer: UserBehaviorAnalyzer instance with loaded data
            show_plot: Whether to display the plots
            
        Returns:
            dict: Dictionary of figure objects
        """
        if analyzer.processed_data is None:
            raise ValueError("Analyzer must have processed data loaded")
        
        df = analyzer.processed_data
        
        # Run analyses to get structured data
        device_analysis = analyzer.device_analysis()
        temporal_analysis = analyzer.temporal_analysis()
        geographic_analysis = analyzer.geographic_analysis()
        referrer_analysis = analyzer.referrer_analysis()
        
        figures = {}
        
        # Create individual plots
        figures['device_distribution'] = self.plot_device_distribution(df, show_plot)
        figures['referrer_distribution'] = self.plot_referrer_distribution(df, show_plot)
        figures['conversion_by_device'] = self.plot_conversion_by_device(df, show_plot)
        figures['temporal_trends'] = self.plot_temporal_trends(
            temporal_analysis['hourly_patterns'], show_plot
        )
        figures['geographic_analysis'] = self.plot_geographic_analysis(
            geographic_analysis, show_plot
        )
        figures['referrer_analysis'] = self.plot_referrer_analysis(
            referrer_analysis, show_plot
        )
        figures['engagement_distribution'] = self.plot_engagement_distribution(df, show_plot)
        
        return figures
    
    def save_dashboard(self, figures: Dict[str, plt.Figure], output_dir: str = 'plots') -> None:
        """
        Save all dashboard figures to files.
        
        Args:
            figures: Dictionary of figure objects
            output_dir: Directory to save plots
        """
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        for name, fig in figures.items():
            fig.savefig(f"{output_dir}/{name}.png", dpi=300, bbox_inches='tight')
            
        print(f"Saved {len(figures)} plots to {output_dir}/")
    
    @staticmethod
    def close_all_figures() -> None:
        """Close all matplotlib figures to free memory."""
        plt.close('all')