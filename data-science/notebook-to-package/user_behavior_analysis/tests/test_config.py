"""
Tests for config module.
"""

import pytest
from user_behavior_analysis.config import AnalysisConfig, DEFAULT_CONFIG, REQUIRED_COLUMNS


class TestAnalysisConfig:
    """Test cases for AnalysisConfig class."""
    
    def test_default_config_creation(self):
        """Test that default config is created correctly."""
        config = AnalysisConfig()
        
        assert config.high_engagement_pages == 5
        assert config.high_engagement_time_minutes == 15.0
        assert config.remove_duplicates is True
        assert config.figure_size_default == (10, 6)
        assert config.figure_size_large == (15, 10)
    
    def test_custom_config_creation(self):
        """Test creating config with custom parameters."""
        config = AnalysisConfig(
            high_engagement_pages=10,
            high_engagement_time_minutes=20.0,
            remove_duplicates=False
        )
        
        assert config.high_engagement_pages == 10
        assert config.high_engagement_time_minutes == 20.0
        assert config.remove_duplicates is False
    
    def test_post_init_peak_hours(self):
        """Test that peak hours are set in __post_init__."""
        config = AnalysisConfig()
        
        assert config.peak_hours is not None
        assert isinstance(config.peak_hours, list)
        assert len(config.peak_hours) == 5
        assert all(isinstance(hour, int) for hour in config.peak_hours)
    
    def test_post_init_engagement_weights(self):
        """Test that engagement weights are set in __post_init__."""
        config = AnalysisConfig()
        
        assert config.engagement_weights is not None
        assert isinstance(config.engagement_weights, dict)
        assert 'page_views' in config.engagement_weights
        assert 'time_spent' in config.engagement_weights
        assert 'bounce_rate' in config.engagement_weights
    
    def test_create_custom_method(self):
        """Test the create_custom class method."""
        config = AnalysisConfig.create_custom(
            high_engagement_pages=7,
            figure_size_default=(12, 8)
        )
        
        assert config.high_engagement_pages == 7
        assert config.figure_size_default == (12, 8)
        assert config.high_engagement_time_minutes == 15.0  # Default value
    
    def test_default_config_instance(self):
        """Test that DEFAULT_CONFIG is properly initialized."""
        assert isinstance(DEFAULT_CONFIG, AnalysisConfig)
        assert DEFAULT_CONFIG.peak_hours is not None
        assert DEFAULT_CONFIG.engagement_weights is not None
    
    def test_required_columns_constant(self):
        """Test that REQUIRED_COLUMNS contains expected columns."""
        expected_columns = [
            'user_id', 'timestamp', 'page_views', 'time_spent_minutes',
            'conversion', 'device_type', 'referrer_type', 'country', 'bounce_rate'
        ]
        
        assert set(REQUIRED_COLUMNS) == set(expected_columns)
        assert len(REQUIRED_COLUMNS) == len(expected_columns)