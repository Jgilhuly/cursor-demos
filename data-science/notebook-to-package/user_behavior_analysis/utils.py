"""
Utility functions for user behavior analysis.

Contains data loading, validation, and preprocessing functions.
"""

import pandas as pd
import numpy as np
import warnings
from pathlib import Path
from typing import Union, List, Optional

from .config import REQUIRED_COLUMNS, COLUMN_TYPES


class DataValidationError(Exception):
    """Exception raised for data validation errors."""
    pass


def load_data(file_path: Union[str, Path]) -> pd.DataFrame:
    """
    Load user behavior data from CSV file.
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        pandas.DataFrame: Loaded data
        
    Raises:
        FileNotFoundError: If file doesn't exist
        DataValidationError: If data validation fails
    """
    file_path = Path(file_path)
    
    if not file_path.exists():
        raise FileNotFoundError(f"Data file not found: {file_path}")
    
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        raise DataValidationError(f"Error reading CSV file: {e}")
    
    # Validate data structure
    validate_data_structure(df)
    
    return df


def validate_data_structure(df: pd.DataFrame) -> None:
    """
    Validate that dataframe has required columns and structure.
    
    Args:
        df: DataFrame to validate
        
    Raises:
        DataValidationError: If validation fails
    """
    # Check for empty dataframe first
    if df.empty:
        raise DataValidationError("DataFrame is empty")
    
    # Check required columns
    missing_columns = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing_columns:
        raise DataValidationError(
            f"Missing required columns: {missing_columns}"
        )
    
    # Basic data type validation
    for col in REQUIRED_COLUMNS:
        if col in df.columns and df[col].isna().all():
            raise DataValidationError(f"Column '{col}' contains only null values")


def preprocess_data(df: pd.DataFrame, remove_duplicates: bool = True) -> pd.DataFrame:
    """
    Preprocess the user behavior data.
    
    Args:
        df: Input dataframe
        remove_duplicates: Whether to remove duplicate rows
        
    Returns:
        pandas.DataFrame: Preprocessed data
    """
    df = df.copy()
    
    # Suppress pandas warnings for chained assignments
    with warnings.catch_warnings():
        warnings.filterwarnings('ignore', category=pd.errors.SettingWithCopyWarning)
        
        # Convert timestamp to datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Extract time-based features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Remove duplicates if requested
        if remove_duplicates:
            initial_rows = len(df)
            df = df.drop_duplicates()
            removed_rows = initial_rows - len(df)
            if removed_rows > 0:
                print(f"Removed {removed_rows} duplicate rows")
    
    return df


def calculate_conversion_rate_by_group(
    df: pd.DataFrame, 
    group_column: str
) -> pd.Series:
    """
    Calculate conversion rate by a grouping column.
    
    Args:
        df: Input dataframe
        group_column: Column to group by
        
    Returns:
        pandas.Series: Conversion rates by group
    """
    return df.groupby(group_column)['conversion'].mean()


def identify_high_engagement_users(
    df: pd.DataFrame,
    page_threshold: int = 5,
    time_threshold: float = 15.0
) -> pd.DataFrame:
    """
    Identify users with high engagement based on thresholds.
    
    Args:
        df: Input dataframe
        page_threshold: Minimum page views for high engagement
        time_threshold: Minimum time spent (minutes) for high engagement
        
    Returns:
        pandas.DataFrame: High engagement users
    """
    return df[
        (df['page_views'] >= page_threshold) | 
        (df['time_spent_minutes'] >= time_threshold)
    ]


def calculate_peak_hours(df: pd.DataFrame, metric: str = 'conversion') -> List[int]:
    """
    Calculate peak hours based on a given metric.
    
    Args:
        df: Input dataframe
        metric: Metric to use for determining peak hours
        
    Returns:
        List[int]: Hours with highest metric values
    """
    hourly_data = df.groupby('hour')[metric].mean()
    
    # Get top 5 hours by metric
    peak_hours = hourly_data.nlargest(5).index.tolist()
    
    return sorted(peak_hours)


def calculate_engagement_score(
    df: pd.DataFrame,
    weights: dict = None
) -> pd.DataFrame:
    """
    Calculate engagement score based on multiple metrics.
    
    Args:
        df: Input dataframe with engagement metrics
        weights: Dictionary of weights for different metrics
        
    Returns:
        pandas.DataFrame: Data with engagement scores
    """
    if weights is None:
        weights = {'page_views': 0.3, 'time_spent': 0.4, 'bounce_rate': 0.3}
    
    df = df.copy()
    
    # Normalize metrics to 0-1 scale
    if 'avg_pages' in df.columns:
        normalized_pages = df['avg_pages'] / df['avg_pages'].max()
    else:
        normalized_pages = df['page_views'] / df['page_views'].max()
        
    if 'avg_time' in df.columns:
        normalized_time = df['avg_time'] / df['avg_time'].max()
    else:
        normalized_time = df['time_spent_minutes'] / df['time_spent_minutes'].max()
        
    if 'bounce' in df.columns:
        normalized_bounce = 1 - df['bounce']  # Lower bounce is better
    else:
        normalized_bounce = 1 - df['bounce_rate']
    
    # Calculate weighted engagement score
    df['engagement_score'] = (
        normalized_pages * weights.get('page_views', weights.get('avg_pages', 0.3)) +
        normalized_time * weights.get('time_spent', weights.get('avg_time', 0.4)) +
        normalized_bounce * weights.get('bounce_rate', weights.get('bounce', 0.3))
    )
    
    return df


def get_summary_stats(df: pd.DataFrame) -> dict:
    """
    Calculate summary statistics for the dataset.
    
    Args:
        df: Input dataframe
        
    Returns:
        dict: Summary statistics
    """
    return {
        'total_users': df['user_id'].nunique(),
        'total_sessions': len(df),
        'overall_conversion_rate': df['conversion'].mean(),
        'avg_session_duration': df['time_spent_minutes'].mean(),
        'avg_pages_per_session': df['page_views'].mean(),
        'date_range': {
            'start': df['timestamp'].min(),
            'end': df['timestamp'].max()
        }
    }