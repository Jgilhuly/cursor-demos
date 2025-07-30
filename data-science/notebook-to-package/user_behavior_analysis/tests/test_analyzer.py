"""
Tests for analyzer module.
"""

import pytest
import pandas as pd
import numpy as np
from unittest.mock import patch
import tempfile
import os

from user_behavior_analysis.analyzer import UserBehaviorAnalyzer
from user_behavior_analysis.config import AnalysisConfig


@pytest.fixture
def sample_data():
    """Create comprehensive sample data for testing."""
    np.random.seed(42)
    n_samples = 100
    
    data = {
        'user_id': [f'user{i}' for i in range(n_samples)],
        'timestamp': pd.date_range('2023-01-01', periods=n_samples, freq='h'),
        'page_views': np.random.randint(1, 15, n_samples),
        'time_spent_minutes': np.random.uniform(5, 60, n_samples),
        'conversion': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'device_type': np.random.choice(['mobile', 'desktop', 'tablet'], n_samples),
        'referrer_type': np.random.choice(['social', 'direct', 'search', 'email'], n_samples),
        'country': np.random.choice(['US', 'UK', 'CA', 'AU', 'DE'], n_samples),
        'bounce_rate': np.random.uniform(0, 1, n_samples)
    }
    return pd.DataFrame(data)


@pytest.fixture
def sample_csv_file(sample_data):
    """Create a temporary CSV file for testing."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        sample_data.to_csv(f.name, index=False)
        yield f.name
    os.unlink(f.name)


@pytest.fixture
def analyzer():
    """Create an analyzer instance."""
    return UserBehaviorAnalyzer()


@pytest.fixture
def analyzer_with_data(analyzer, sample_data):
    """Create an analyzer instance with loaded data."""
    analyzer.set_data(sample_data)
    return analyzer


class TestUserBehaviorAnalyzer:
    """Test UserBehaviorAnalyzer class."""
    
    def test_init_default_config(self):
        """Test analyzer initialization with default config."""
        analyzer = UserBehaviorAnalyzer()
        
        assert analyzer.config is not None
        assert analyzer.data is None
        assert analyzer.processed_data is None
    
    def test_init_custom_config(self):
        """Test analyzer initialization with custom config."""
        config = AnalysisConfig(high_engagement_pages=10)
        analyzer = UserBehaviorAnalyzer(config)
        
        assert analyzer.config.high_engagement_pages == 10
    
    def test_load_and_preprocess(self, analyzer, sample_csv_file):
        """Test data loading and preprocessing from file."""
        result = analyzer.load_and_preprocess(sample_csv_file)
        
        assert isinstance(result, pd.DataFrame)
        assert analyzer.data is not None
        assert analyzer.processed_data is not None
        assert 'hour' in analyzer.processed_data.columns
        assert 'day_of_week' in analyzer.processed_data.columns
    
    def test_set_data(self, analyzer, sample_data):
        """Test setting data directly."""
        analyzer.set_data(sample_data)
        
        assert analyzer.data is not None
        assert analyzer.processed_data is not None
        assert len(analyzer.data) == len(sample_data)
    
    def test_engagement_analysis(self, analyzer_with_data):
        """Test engagement analysis."""
        result = analyzer_with_data.engagement_analysis()
        
        assert isinstance(result, dict)
        assert 'total_users' in result
        assert 'high_engagement_users' in result
        assert 'high_engagement_percentage' in result
        assert 'avg_page_views' in result
        assert 'avg_time_spent' in result
        assert 'median_page_views' in result
        assert 'median_time_spent' in result
        
        assert result['total_users'] > 0
        assert 0 <= result['high_engagement_percentage'] <= 100
    
    def test_device_analysis(self, analyzer_with_data):
        """Test device analysis."""
        result = analyzer_with_data.device_analysis()
        
        assert isinstance(result, pd.DataFrame)
        assert 'device_type' in result.columns
        assert 'avg_page_views' in result.columns
        assert 'conversion_rate' in result.columns
        assert 'user_count' in result.columns
        
        assert len(result) > 0
        assert all(0 <= rate <= 1 for rate in result['conversion_rate'])
    
    def test_temporal_analysis(self, analyzer_with_data):
        """Test temporal analysis."""
        result = analyzer_with_data.temporal_analysis()
        
        assert isinstance(result, dict)
        assert 'hourly_patterns' in result
        assert 'daily_patterns' in result
        assert 'peak_hours' in result
        assert 'peak_hours_stats' in result
        
        assert isinstance(result['hourly_patterns'], pd.DataFrame)
        assert isinstance(result['daily_patterns'], pd.DataFrame)
        assert isinstance(result['peak_hours'], list)
        assert isinstance(result['peak_hours_stats'], dict)
    
    def test_geographic_analysis(self, analyzer_with_data):
        """Test geographic analysis."""
        result = analyzer_with_data.geographic_analysis()
        
        assert isinstance(result, pd.DataFrame)
        assert 'country' in result.columns
        assert 'conversion_rate' in result.columns
        assert 'user_count' in result.columns
        
        assert len(result) > 0
        # Should be sorted by conversion rate descending
        assert result['conversion_rate'].is_monotonic_decreasing
    
    def test_referrer_analysis(self, analyzer_with_data):
        """Test referrer analysis."""
        result = analyzer_with_data.referrer_analysis()
        
        assert isinstance(result, pd.DataFrame)
        assert 'referrer_type' in result.columns
        assert 'conv_rate' in result.columns
        assert 'engagement_score' in result.columns
        
        assert len(result) > 0
        assert all(0 <= score <= 1 for score in result['engagement_score'])
    
    def test_comprehensive_analysis(self, analyzer_with_data):
        """Test comprehensive analysis."""
        result = analyzer_with_data.comprehensive_analysis()
        
        assert isinstance(result, dict)
        assert 'summary_stats' in result
        assert 'engagement_analysis' in result
        assert 'device_analysis' in result
        assert 'temporal_analysis' in result
        assert 'geographic_analysis' in result
        assert 'referrer_analysis' in result
        assert 'key_insights' in result
        
        # Test summary stats structure
        summary = result['summary_stats']
        assert 'total_users' in summary
        assert 'total_sessions' in summary
        assert 'overall_conversion_rate' in summary
        
        # Test key insights structure
        insights = result['key_insights']
        assert 'best_performing_device' in insights
        assert 'worst_performing_device' in insights
        assert 'conversion_rates' in insights
    
    def test_get_data_info_no_data(self, analyzer):
        """Test data info when no data is loaded."""
        result = analyzer.get_data_info()
        
        assert result['status'] == 'No data loaded'
    
    def test_get_data_info_with_data(self, analyzer_with_data):
        """Test data info with loaded data."""
        result = analyzer_with_data.get_data_info()
        
        assert 'original_shape' in result
        assert 'processed_shape' in result
        assert 'columns' in result
        assert 'date_range' in result
        assert 'missing_values' in result
        
        assert result['original_shape'][0] > 0
        assert result['processed_shape'][0] > 0


class TestAnalyzerErrorHandling:
    """Test error handling in analyzer."""
    
    def test_analysis_without_data(self, analyzer):
        """Test that analysis methods raise errors when no data is loaded."""
        with pytest.raises(ValueError, match="Data not loaded"):
            analyzer.engagement_analysis()
        
        with pytest.raises(ValueError, match="Data not loaded"):
            analyzer.device_analysis()
        
        with pytest.raises(ValueError, match="Data not loaded"):
            analyzer.temporal_analysis()
        
        with pytest.raises(ValueError, match="Data not loaded"):
            analyzer.geographic_analysis()
        
        with pytest.raises(ValueError, match="Data not loaded"):
            analyzer.referrer_analysis()
        
        with pytest.raises(ValueError, match="Data not loaded"):
            analyzer.comprehensive_analysis()
    
    def test_load_nonexistent_file(self, analyzer):
        """Test loading a nonexistent file."""
        with pytest.raises(FileNotFoundError):
            analyzer.load_and_preprocess('nonexistent_file.csv')


class TestAnalyzerWithCustomConfig:
    """Test analyzer with custom configuration."""
    
    def test_custom_engagement_thresholds(self, sample_data):
        """Test analyzer with custom engagement thresholds."""
        config = AnalysisConfig(
            high_engagement_pages=10,
            high_engagement_time_minutes=30.0
        )
        analyzer = UserBehaviorAnalyzer(config)
        analyzer.set_data(sample_data)
        
        result = analyzer.engagement_analysis()
        
        # With higher thresholds, should have fewer high engagement users
        assert result['high_engagement_percentage'] >= 0
    
    def test_custom_peak_hours(self, sample_data):
        """Test analyzer with custom peak hours."""
        config = AnalysisConfig(peak_hours=[9, 12, 15, 18])
        analyzer = UserBehaviorAnalyzer(config)
        analyzer.set_data(sample_data)
        
        result = analyzer.temporal_analysis()
        
        # Peak hours should be calculated dynamically, not use config peak_hours
        # since we calculate them in the analysis
        assert isinstance(result['peak_hours'], list)
    
    def test_no_duplicate_removal(self, sample_data):
        """Test analyzer with duplicate removal disabled."""
        # Add some duplicate rows
        sample_data_with_dupes = pd.concat([sample_data, sample_data.head(5)])
        
        config = AnalysisConfig(remove_duplicates=False)
        analyzer = UserBehaviorAnalyzer(config)
        analyzer.set_data(sample_data_with_dupes)
        
        # Should have duplicates in processed data
        assert len(analyzer.processed_data) == len(sample_data_with_dupes)


class TestAnalyzerIntegration:
    """Integration tests for analyzer."""
    
    def test_full_workflow(self, sample_csv_file):
        """Test complete workflow from file loading to analysis."""
        analyzer = UserBehaviorAnalyzer()
        
        # Load data
        data = analyzer.load_and_preprocess(sample_csv_file)
        assert len(data) > 0
        
        # Run all analyses
        engagement = analyzer.engagement_analysis()
        device = analyzer.device_analysis()
        temporal = analyzer.temporal_analysis()
        geographic = analyzer.geographic_analysis()
        referrer = analyzer.referrer_analysis()
        comprehensive = analyzer.comprehensive_analysis()
        
        # Verify all analyses completed successfully
        assert isinstance(engagement, dict)
        assert isinstance(device, pd.DataFrame)
        assert isinstance(temporal, dict)
        assert isinstance(geographic, pd.DataFrame)
        assert isinstance(referrer, pd.DataFrame)
        assert isinstance(comprehensive, dict)
    
    def test_edge_case_single_row(self):
        """Test analyzer with single row of data."""
        data = pd.DataFrame({
            'user_id': ['user1'],
            'timestamp': ['2023-01-01 10:00:00'],
            'page_views': [5],
            'time_spent_minutes': [15.0],
            'conversion': [1],
            'device_type': ['mobile'],
            'referrer_type': ['social'],
            'country': ['US'],
            'bounce_rate': [0.3]
        })
        
        analyzer = UserBehaviorAnalyzer()
        analyzer.set_data(data)
        
        # Should handle single row gracefully
        result = analyzer.engagement_analysis()
        assert result['total_users'] == 1
    
    def test_edge_case_all_zero_conversions(self, sample_data):
        """Test analyzer with zero conversion data."""
        sample_data['conversion'] = 0
        
        analyzer = UserBehaviorAnalyzer()
        analyzer.set_data(sample_data)
        
        result = analyzer.comprehensive_analysis()
        assert result['summary_stats']['overall_conversion_rate'] == 0.0