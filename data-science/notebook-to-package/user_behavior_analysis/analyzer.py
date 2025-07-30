"""
Main analyzer module for user behavior analysis.

Contains the UserBehaviorAnalyzer class with all analysis functionality.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from typing import Union, Optional, Dict, List, Tuple

from .config import AnalysisConfig, DEFAULT_CONFIG
from .utils import (
    load_data, 
    preprocess_data, 
    identify_high_engagement_users,
    calculate_conversion_rate_by_group,
    calculate_peak_hours,
    calculate_engagement_score,
    get_summary_stats
)


class UserBehaviorAnalyzer:
    """
    Main class for analyzing user behavior data.
    
    Provides methods for engagement analysis, conversion analysis,
    geographic analysis, temporal analysis, and referrer analysis.
    """
    
    def __init__(self, config: Optional[AnalysisConfig] = None):
        """
        Initialize the analyzer.
        
        Args:
            config: Configuration object with analysis parameters
        """
        self.config = config or DEFAULT_CONFIG
        self.data: Optional[pd.DataFrame] = None
        self.processed_data: Optional[pd.DataFrame] = None
        
    def load_and_preprocess(self, file_path: Union[str, Path]) -> pd.DataFrame:
        """
        Load and preprocess data from file.
        
        Args:
            file_path: Path to the data file
            
        Returns:
            pandas.DataFrame: Preprocessed data
        """
        self.data = load_data(file_path)
        self.processed_data = preprocess_data(
            self.data, 
            remove_duplicates=self.config.remove_duplicates
        )
        return self.processed_data
    
    def set_data(self, df: pd.DataFrame) -> None:
        """
        Set data directly (useful for testing or when data is already loaded).
        
        Args:
            df: DataFrame with user behavior data
        """
        self.data = df.copy()
        self.processed_data = preprocess_data(
            self.data,
            remove_duplicates=self.config.remove_duplicates
        )
    
    def engagement_analysis(self) -> Dict:
        """
        Analyze user engagement patterns.
        
        Returns:
            dict: Engagement analysis results
        """
        if self.processed_data is None:
            raise ValueError("Data not loaded. Call load_and_preprocess() first.")
        
        df = self.processed_data
        
        # Identify high engagement users
        high_engagement = identify_high_engagement_users(
            df,
            page_threshold=self.config.high_engagement_pages,
            time_threshold=self.config.high_engagement_time_minutes
        )
        
        # Calculate engagement metrics
        results = {
            'total_users': len(df),
            'high_engagement_users': len(high_engagement),
            'high_engagement_percentage': len(high_engagement) / len(df) * 100,
            'avg_page_views': df['page_views'].mean(),
            'avg_time_spent': df['time_spent_minutes'].mean(),
            'median_page_views': df['page_views'].median(),
            'median_time_spent': df['time_spent_minutes'].median()
        }
        
        return results
    
    def device_analysis(self) -> pd.DataFrame:
        """
        Analyze performance by device type.
        
        Returns:
            pandas.DataFrame: Device analysis results
        """
        if self.processed_data is None:
            raise ValueError("Data not loaded. Call load_and_preprocess() first.")
        
        df = self.processed_data
        
        device_stats = df.groupby('device_type').agg({
            'page_views': ['mean', 'median', 'std'],
            'time_spent_minutes': ['mean', 'median', 'std'],
            'conversion': ['mean', 'sum', 'count'],
            'bounce_rate': 'mean',
            'user_id': 'count'
        }).round(3)
        
        # Flatten column names
        device_stats.columns = [
            'avg_page_views', 'median_page_views', 'std_page_views',
            'avg_time_spent', 'median_time_spent', 'std_time_spent', 
            'conversion_rate', 'total_conversions', 'conversion_count',
            'avg_bounce_rate', 'user_count'
        ]
        
        return device_stats.reset_index()
    
    def temporal_analysis(self) -> Dict:
        """
        Analyze temporal patterns in user behavior.
        
        Returns:
            dict: Temporal analysis results including hourly and daily patterns
        """
        if self.processed_data is None:
            raise ValueError("Data not loaded. Call load_and_preprocess() first.")
        
        df = self.processed_data
        
        # Hourly analysis
        hourly_data = df.groupby('hour').agg({
            'page_views': 'mean',
            'time_spent_minutes': 'mean',
            'conversion': 'mean',
            'user_id': 'count'
        }).round(3)
        
        # Daily analysis (day of week)
        daily_data = df.groupby('day_of_week').agg({
            'page_views': 'mean', 
            'time_spent_minutes': 'mean',
            'conversion': 'mean',
            'user_id': 'count'
        }).round(3)
        
        # Calculate peak hours dynamically
        peak_hours = calculate_peak_hours(df, metric='conversion')
        peak_data = df[df['hour'].isin(peak_hours)]
        
        results = {
            'hourly_patterns': hourly_data,
            'daily_patterns': daily_data,
            'peak_hours': peak_hours,
            'peak_hours_stats': {
                'sessions': len(peak_data),
                'conversion_rate': peak_data['conversion'].mean(),
                'avg_page_views': peak_data['page_views'].mean(),
                'avg_time_spent': peak_data['time_spent_minutes'].mean()
            }
        }
        
        return results
    
    def geographic_analysis(self) -> pd.DataFrame:
        """
        Analyze performance by country/geographic region.
        
        Returns:
            pandas.DataFrame: Geographic analysis results
        """
        if self.processed_data is None:
            raise ValueError("Data not loaded. Call load_and_preprocess() first.")
        
        df = self.processed_data
        
        country_stats = df.groupby('country').agg({
            'page_views': ['mean', 'sum'],
            'time_spent_minutes': ['mean', 'sum'],
            'conversion': ['mean', 'sum'],
            'bounce_rate': 'mean',
            'user_id': 'count'
        }).round(3)
        
        # Flatten column names
        country_stats.columns = [
            'avg_page_views', 'total_page_views',
            'avg_time_spent', 'total_time_spent',
            'conversion_rate', 'total_conversions',
            'avg_bounce_rate', 'user_count'
        ]
        
        return country_stats.reset_index().sort_values('conversion_rate', ascending=False)
    
    def referrer_analysis(self) -> pd.DataFrame:
        """
        Analyze performance by referrer type.
        
        Returns:
            pandas.DataFrame: Referrer analysis results with engagement scores
        """
        if self.processed_data is None:
            raise ValueError("Data not loaded. Call load_and_preprocess() first.")
        
        df = self.processed_data
        
        referrer_stats = df.groupby('referrer_type').agg({
            'page_views': 'mean',
            'time_spent_minutes': 'mean',
            'conversion': 'mean',
            'bounce_rate': 'mean',
            'user_id': 'count'
        }).round(3)
        
        referrer_stats.columns = [
            'avg_pages', 'avg_time', 'conv_rate', 'bounce', 'users'
        ]
        
        # Calculate engagement scores
        referrer_stats = calculate_engagement_score(
            referrer_stats.reset_index(),
            weights=self.config.engagement_weights
        )
        
        return referrer_stats.sort_values('conv_rate', ascending=False)
    
    def comprehensive_analysis(self) -> Dict:
        """
        Run all analysis methods and return comprehensive results.
        
        Returns:
            dict: Complete analysis results
        """
        if self.processed_data is None:
            raise ValueError("Data not loaded. Call load_and_preprocess() first.")
        
        results = {
            'summary_stats': get_summary_stats(self.processed_data),
            'engagement_analysis': self.engagement_analysis(),
            'device_analysis': self.device_analysis(),
            'temporal_analysis': self.temporal_analysis(),
            'geographic_analysis': self.geographic_analysis(),
            'referrer_analysis': self.referrer_analysis()
        }
        
        # Add best/worst performers
        results['key_insights'] = self._extract_key_insights()
        
        return results
    
    def _extract_key_insights(self) -> Dict:
        """
        Extract key insights from the analysis.
        
        Returns:
            dict: Key insights and recommendations
        """
        df = self.processed_data
        
        # Best/worst performers
        device_conversion = calculate_conversion_rate_by_group(df, 'device_type')
        country_conversion = calculate_conversion_rate_by_group(df, 'country')
        referrer_conversion = calculate_conversion_rate_by_group(df, 'referrer_type')
        
        insights = {
            'best_performing_device': device_conversion.idxmax(),
            'worst_performing_device': device_conversion.idxmin(),
            'best_performing_country': country_conversion.idxmax(),
            'worst_performing_country': country_conversion.idxmin(),
            'best_performing_referrer': referrer_conversion.idxmax(),
            'worst_performing_referrer': referrer_conversion.idxmin(),
            'conversion_rates': {
                'device': device_conversion.to_dict(),
                'country': country_conversion.to_dict(),
                'referrer': referrer_conversion.to_dict()
            }
        }
        
        return insights
    
    def get_data_info(self) -> Dict:
        """
        Get information about the loaded data.
        
        Returns:
            dict: Data information
        """
        if self.data is None:
            return {'status': 'No data loaded'}
        
        return {
            'original_shape': self.data.shape,
            'processed_shape': self.processed_data.shape if self.processed_data is not None else None,
            'columns': self.data.columns.tolist(),
            'date_range': {
                'start': self.data['timestamp'].min() if 'timestamp' in self.data.columns else None,
                'end': self.data['timestamp'].max() if 'timestamp' in self.data.columns else None
            },
            'missing_values': self.data.isnull().sum().to_dict()
        }