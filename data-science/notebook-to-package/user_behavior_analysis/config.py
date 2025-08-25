"""
Configuration module for user behavior analysis.

Contains configurable constants, thresholds, and default values.
"""

from dataclasses import dataclass
from typing import List, Dict, Any


@dataclass
class AnalysisConfig:
    """Configuration class for analysis parameters."""
    
    # Engagement thresholds
    high_engagement_pages: int = 5
    high_engagement_time_minutes: float = 15.0
    
    # Peak hours (can be calculated dynamically if None)
    peak_hours: List[int] = None
    
    # Engagement score weights
    engagement_weights: Dict[str, float] = None
    
    # Data validation settings
    remove_duplicates: bool = True
    
    # Visualization settings
    figure_size_default: tuple = (10, 6)
    figure_size_large: tuple = (15, 10)
    
    def __post_init__(self):
        """Set default values after initialization."""
        if self.peak_hours is None:
            self.peak_hours = [10, 14, 16, 18, 20]
            
        if self.engagement_weights is None:
            self.engagement_weights = {
                'page_views': 0.3,
                'time_spent': 0.4, 
                'bounce_rate': 0.3
            }
    
    @classmethod
    def create_custom(cls, **kwargs) -> 'AnalysisConfig':
        """Create a custom configuration with specified parameters."""
        return cls(**kwargs)


# Default configuration instance
DEFAULT_CONFIG = AnalysisConfig()

# Required data columns
REQUIRED_COLUMNS = [
    'user_id',
    'timestamp', 
    'page_views',
    'time_spent_minutes',
    'conversion',
    'device_type',
    'referrer_type',
    'country',
    'bounce_rate'
]

# Expected data types for validation
COLUMN_TYPES = {
    'user_id': 'object',
    'timestamp': 'datetime64[ns]',
    'page_views': 'int64',
    'time_spent_minutes': 'float64', 
    'conversion': 'int64',
    'device_type': 'object',
    'referrer_type': 'object',
    'country': 'object',
    'bounce_rate': 'float64'
}