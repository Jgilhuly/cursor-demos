"""
Tests for utils module.
"""

import pytest
import pandas as pd
import numpy as np
from datetime import datetime
from pathlib import Path
import tempfile
import os

from user_behavior_analysis.utils import (
    load_data, validate_data_structure, preprocess_data,
    calculate_conversion_rate_by_group, identify_high_engagement_users,
    calculate_peak_hours, calculate_engagement_score, get_summary_stats,
    DataValidationError
)


@pytest.fixture
def sample_data():
    """Create sample data for testing."""
    data = {
        'user_id': ['user1', 'user2', 'user3', 'user1', 'user2'],
        'timestamp': ['2023-01-01 10:00:00', '2023-01-01 14:00:00', 
                     '2023-01-01 16:00:00', '2023-01-01 20:00:00', '2023-01-01 22:00:00'],
        'page_views': [3, 7, 2, 10, 5],
        'time_spent_minutes': [10.5, 25.0, 8.0, 30.0, 15.0],
        'conversion': [0, 1, 0, 1, 0],
        'device_type': ['mobile', 'desktop', 'tablet', 'mobile', 'desktop'],
        'referrer_type': ['social', 'direct', 'search', 'social', 'search'],
        'country': ['US', 'UK', 'CA', 'US', 'UK'],
        'bounce_rate': [0.3, 0.1, 0.6, 0.2, 0.4]
    }
    return pd.DataFrame(data)


@pytest.fixture
def sample_csv_file(sample_data):
    """Create a temporary CSV file for testing."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        sample_data.to_csv(f.name, index=False)
        yield f.name
    os.unlink(f.name)


class TestDataLoading:
    """Test data loading functions."""
    
    def test_load_data_success(self, sample_csv_file):
        """Test successful data loading."""
        df = load_data(sample_csv_file)
        
        assert isinstance(df, pd.DataFrame)
        assert len(df) == 5
        assert 'user_id' in df.columns
    
    def test_load_data_file_not_found(self):
        """Test error when file doesn't exist."""
        with pytest.raises(FileNotFoundError):
            load_data('nonexistent_file.csv')
    
    def test_validate_data_structure_success(self, sample_data):
        """Test successful data validation."""
        # Should not raise any exception
        validate_data_structure(sample_data)
    
    def test_validate_data_structure_missing_columns(self):
        """Test validation failure with missing columns."""
        df = pd.DataFrame({'user_id': [1, 2, 3]})
        
        with pytest.raises(DataValidationError, match="Missing required columns"):
            validate_data_structure(df)
    
    def test_validate_data_structure_empty_dataframe(self):
        """Test validation failure with empty dataframe."""
        df = pd.DataFrame()
        
        with pytest.raises(DataValidationError, match="DataFrame is empty"):
            validate_data_structure(df)


class TestDataPreprocessing:
    """Test data preprocessing functions."""
    
    def test_preprocess_data_basic(self, sample_data):
        """Test basic data preprocessing."""
        processed = preprocess_data(sample_data)
        
        assert 'hour' in processed.columns
        assert 'day_of_week' in processed.columns
        assert processed['timestamp'].dtype == 'datetime64[ns]'
    
    def test_preprocess_data_remove_duplicates(self):
        """Test duplicate removal."""
        data = pd.DataFrame({
            'user_id': ['user1', 'user1', 'user2'],
            'timestamp': ['2023-01-01 10:00:00'] * 3,
            'page_views': [3, 3, 5],
            'time_spent_minutes': [10.5, 10.5, 15.0],
            'conversion': [0, 0, 1],
            'device_type': ['mobile'] * 3,
            'referrer_type': ['social'] * 3,
            'country': ['US'] * 3,
            'bounce_rate': [0.3] * 3
        })
        
        processed = preprocess_data(data, remove_duplicates=True)
        assert len(processed) == 2  # One duplicate removed
    
    def test_preprocess_data_no_duplicate_removal(self):
        """Test preprocessing without duplicate removal."""
        data = pd.DataFrame({
            'user_id': ['user1', 'user1'],
            'timestamp': ['2023-01-01 10:00:00'] * 2,
            'page_views': [3, 3],
            'time_spent_minutes': [10.5, 10.5],
            'conversion': [0, 0],
            'device_type': ['mobile'] * 2,
            'referrer_type': ['social'] * 2,
            'country': ['US'] * 2,
            'bounce_rate': [0.3] * 2
        })
        
        processed = preprocess_data(data, remove_duplicates=False)
        assert len(processed) == 2  # No duplicates removed


class TestAnalysisFunctions:
    """Test analysis functions."""
    
    def test_calculate_conversion_rate_by_group(self, sample_data):
        """Test conversion rate calculation by group."""
        processed = preprocess_data(sample_data)
        conversion_rates = calculate_conversion_rate_by_group(processed, 'device_type')
        
        assert isinstance(conversion_rates, pd.Series)
        assert 'mobile' in conversion_rates.index
        assert 'desktop' in conversion_rates.index
        assert all(0 <= rate <= 1 for rate in conversion_rates.values)
    
    def test_identify_high_engagement_users(self, sample_data):
        """Test high engagement user identification."""
        processed = preprocess_data(sample_data)
        high_eng = identify_high_engagement_users(processed, page_threshold=5, time_threshold=20.0)
        
        assert isinstance(high_eng, pd.DataFrame)
        assert len(high_eng) <= len(processed)
        # Should include users with 7 pages or 25.0/30.0 minutes
        assert len(high_eng) >= 2
    
    def test_calculate_peak_hours(self, sample_data):
        """Test peak hours calculation."""
        processed = preprocess_data(sample_data)
        peak_hours = calculate_peak_hours(processed, metric='conversion')
        
        assert isinstance(peak_hours, list)
        assert all(isinstance(hour, (int, np.integer)) for hour in peak_hours)
        assert all(0 <= hour <= 23 for hour in peak_hours)
        assert len(peak_hours) <= 5
    
    def test_calculate_engagement_score(self):
        """Test engagement score calculation."""
        data = pd.DataFrame({
            'avg_pages': [3, 7, 5],
            'avg_time': [10, 25, 15],
            'bounce': [0.3, 0.1, 0.2]
        })
        
        result = calculate_engagement_score(data)
        
        assert 'engagement_score' in result.columns
        assert all(0 <= score <= 1 for score in result['engagement_score'])
    
    def test_get_summary_stats(self, sample_data):
        """Test summary statistics calculation."""
        processed = preprocess_data(sample_data)
        stats = get_summary_stats(processed)
        
        assert isinstance(stats, dict)
        assert 'total_users' in stats
        assert 'total_sessions' in stats
        assert 'overall_conversion_rate' in stats
        assert 'avg_session_duration' in stats
        assert 'avg_pages_per_session' in stats
        assert 'date_range' in stats
        
        assert stats['total_users'] == 3
        assert stats['total_sessions'] == 5
        assert 0 <= stats['overall_conversion_rate'] <= 1


class TestErrorHandling:
    """Test error handling in utility functions."""
    
    def test_identify_high_engagement_users_empty_result(self):
        """Test high engagement identification with no matches."""
        data = pd.DataFrame({
            'user_id': ['user1', 'user2'],
            'timestamp': ['2023-01-01 10:00:00'] * 2,
            'page_views': [1, 2],
            'time_spent_minutes': [5.0, 8.0],
            'conversion': [0, 0],
            'device_type': ['mobile'] * 2,
            'referrer_type': ['social'] * 2,
            'country': ['US'] * 2,
            'bounce_rate': [0.3] * 2
        })
        
        processed = preprocess_data(data)
        high_eng = identify_high_engagement_users(processed, page_threshold=10, time_threshold=20.0)
        
        assert len(high_eng) == 0
    
    def test_calculate_peak_hours_insufficient_data(self):
        """Test peak hours calculation with limited data."""
        data = pd.DataFrame({
            'user_id': ['user1'],
            'timestamp': ['2023-01-01 10:00:00'],
            'page_views': [3],
            'time_spent_minutes': [10.0],
            'conversion': [0],
            'device_type': ['mobile'],
            'referrer_type': ['social'],
            'country': ['US'],
            'bounce_rate': [0.3]
        })
        
        processed = preprocess_data(data)
        peak_hours = calculate_peak_hours(processed, metric='conversion')
        
        assert isinstance(peak_hours, list)
        assert len(peak_hours) <= 1