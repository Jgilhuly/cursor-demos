"""
Tests for visualizer module.
"""

import pytest
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from unittest.mock import patch, MagicMock
import tempfile
import os

from user_behavior_analysis.visualizer import UserBehaviorVisualizer
from user_behavior_analysis.analyzer import UserBehaviorAnalyzer
from user_behavior_analysis.config import AnalysisConfig


@pytest.fixture
def sample_data():
    """Create sample data for testing."""
    np.random.seed(42)
    n_samples = 50
    
    data = {
        'user_id': [f'user{i}' for i in range(n_samples)],
        'timestamp': pd.date_range('2023-01-01', periods=n_samples, freq='h'),
        'page_views': np.random.randint(1, 15, n_samples),
        'time_spent_minutes': np.random.uniform(5, 60, n_samples),
        'conversion': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'device_type': np.random.choice(['mobile', 'desktop', 'tablet'], n_samples),
        'referrer_type': np.random.choice(['social', 'direct', 'search'], n_samples),
        'country': np.random.choice(['US', 'UK', 'CA'], n_samples),
        'bounce_rate': np.random.uniform(0, 1, n_samples)
    }
    return pd.DataFrame(data)


@pytest.fixture
def visualizer():
    """Create a visualizer instance."""
    return UserBehaviorVisualizer()


@pytest.fixture
def analyzer_with_data(sample_data):
    """Create an analyzer instance with loaded data."""
    analyzer = UserBehaviorAnalyzer()
    analyzer.set_data(sample_data)
    return analyzer


class TestUserBehaviorVisualizer:
    """Test UserBehaviorVisualizer class."""
    
    def test_init_default_config(self):
        """Test visualizer initialization with default config."""
        visualizer = UserBehaviorVisualizer()
        
        assert visualizer.config is not None
    
    def test_init_custom_config(self):
        """Test visualizer initialization with custom config."""
        config = AnalysisConfig(figure_size_default=(12, 8))
        visualizer = UserBehaviorVisualizer(config)
        
        assert visualizer.config.figure_size_default == (12, 8)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_device_distribution(self, mock_show, visualizer, sample_data):
        """Test device distribution plotting."""
        fig = visualizer.plot_device_distribution(sample_data, show_plot=True)
        
        assert isinstance(fig, plt.Figure)
        assert len(fig.axes) == 2  # Bar chart and pie chart
        mock_show.assert_called_once()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_device_distribution_no_show(self, mock_show, visualizer, sample_data):
        """Test device distribution plotting without showing."""
        fig = visualizer.plot_device_distribution(sample_data, show_plot=False)
        
        assert isinstance(fig, plt.Figure)
        mock_show.assert_not_called()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_referrer_distribution(self, mock_show, visualizer, sample_data):
        """Test referrer distribution plotting."""
        fig = visualizer.plot_referrer_distribution(sample_data, show_plot=True)
        
        assert isinstance(fig, plt.Figure)
        assert len(fig.axes) == 1  # Pie chart only
        mock_show.assert_called_once()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_conversion_by_device(self, mock_show, visualizer, sample_data):
        """Test conversion by device plotting."""
        fig = visualizer.plot_conversion_by_device(sample_data, show_plot=True)
        
        assert isinstance(fig, plt.Figure)
        assert len(fig.axes) == 1
        mock_show.assert_called_once()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_temporal_trends(self, mock_show, visualizer, analyzer_with_data):
        """Test temporal trends plotting."""
        temporal_analysis = analyzer_with_data.temporal_analysis()
        hourly_data = temporal_analysis['hourly_patterns']
        
        fig = visualizer.plot_temporal_trends(hourly_data, show_plot=True)
        
        assert isinstance(fig, plt.Figure)
        assert len(fig.axes) == 4  # Four subplots
        mock_show.assert_called_once()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_geographic_analysis(self, mock_show, visualizer, analyzer_with_data):
        """Test geographic analysis plotting."""
        geographic_data = analyzer_with_data.geographic_analysis()
        
        fig = visualizer.plot_geographic_analysis(geographic_data, show_plot=True)
        
        assert isinstance(fig, plt.Figure)
        assert len(fig.axes) == 2  # Two subplots
        mock_show.assert_called_once()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_referrer_analysis(self, mock_show, visualizer, analyzer_with_data):
        """Test referrer analysis plotting."""
        referrer_data = analyzer_with_data.referrer_analysis()
        
        fig = visualizer.plot_referrer_analysis(referrer_data, show_plot=True)
        
        assert isinstance(fig, plt.Figure)
        assert len(fig.axes) == 6  # Six subplots (2x3 grid)
        mock_show.assert_called_once()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_plot_engagement_distribution(self, mock_show, visualizer, sample_data):
        """Test engagement distribution plotting."""
        fig = visualizer.plot_engagement_distribution(sample_data, show_plot=True)
        
        assert isinstance(fig, plt.Figure)
        assert len(fig.axes) == 4  # Four subplots (2x2 grid)
        mock_show.assert_called_once()
        plt.close(fig)
    
    @patch('matplotlib.pyplot.show')
    def test_create_dashboard(self, mock_show, visualizer, analyzer_with_data):
        """Test dashboard creation."""
        figures = visualizer.create_dashboard(analyzer_with_data, show_plot=True)
        
        assert isinstance(figures, dict)
        assert len(figures) == 7  # Seven different plots
        
        expected_plots = [
            'device_distribution', 'referrer_distribution', 'conversion_by_device',
            'temporal_trends', 'geographic_analysis', 'referrer_analysis',
            'engagement_distribution'
        ]
        
        for plot_name in expected_plots:
            assert plot_name in figures
            assert isinstance(figures[plot_name], plt.Figure)
        
        # Close all figures
        for fig in figures.values():
            plt.close(fig)
    
    def test_create_dashboard_no_data(self, visualizer):
        """Test dashboard creation with no data."""
        analyzer = UserBehaviorAnalyzer()
        
        with pytest.raises(ValueError, match="Analyzer must have processed data loaded"):
            visualizer.create_dashboard(analyzer)
    
    def test_save_dashboard(self, visualizer, analyzer_with_data):
        """Test saving dashboard plots."""
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create dashboard
            figures = visualizer.create_dashboard(analyzer_with_data, show_plot=False)
            
            # Save dashboard
            visualizer.save_dashboard(figures, output_dir=temp_dir)
            
            # Check that files were created
            saved_files = os.listdir(temp_dir)
            assert len(saved_files) == len(figures)
            
            for plot_name in figures.keys():
                expected_file = f"{plot_name}.png"
                assert expected_file in saved_files
            
            # Close all figures
            for fig in figures.values():
                plt.close(fig)
    
    def test_close_all_figures(self):
        """Test closing all figures."""
        # Create some figures
        fig1 = plt.figure()
        fig2 = plt.figure()
        
        # Should have 2 figures open
        assert len(plt.get_fignums()) == 2
        
        # Close all
        UserBehaviorVisualizer.close_all_figures()
        
        # Should have no figures open
        assert len(plt.get_fignums()) == 0


class TestVisualizerErrorHandling:
    """Test error handling in visualizer."""
    
    def test_plot_with_empty_dataframe(self, visualizer):
        """Test plotting with empty dataframe."""
        empty_df = pd.DataFrame()
        
        # Should handle empty dataframe gracefully
        with pytest.raises(KeyError):  # Expected since columns don't exist
            visualizer.plot_device_distribution(empty_df, show_plot=False)
    
    def test_plot_with_missing_columns(self, visualizer):
        """Test plotting with missing required columns."""
        df = pd.DataFrame({'wrong_column': [1, 2, 3]})
        
        with pytest.raises(KeyError):
            visualizer.plot_device_distribution(df, show_plot=False)


class TestVisualizerIntegration:
    """Integration tests for visualizer."""
    
    def test_full_visualization_workflow(self, sample_data):
        """Test complete visualization workflow."""
        # Setup analyzer
        analyzer = UserBehaviorAnalyzer()
        analyzer.set_data(sample_data)
        
        # Setup visualizer
        visualizer = UserBehaviorVisualizer()
        
        # Create individual plots
        fig1 = visualizer.plot_device_distribution(sample_data, show_plot=False)
        fig2 = visualizer.plot_conversion_by_device(sample_data, show_plot=False)
        fig3 = visualizer.plot_engagement_distribution(sample_data, show_plot=False)
        
        # Create dashboard
        figures = visualizer.create_dashboard(analyzer, show_plot=False)
        
        # All should be successful
        assert isinstance(fig1, plt.Figure)
        assert isinstance(fig2, plt.Figure)
        assert isinstance(fig3, plt.Figure)
        assert isinstance(figures, dict)
        assert len(figures) > 0
        
        # Clean up
        plt.close(fig1)
        plt.close(fig2)
        plt.close(fig3)
        for fig in figures.values():
            plt.close(fig)
    
    def test_custom_config_visualization(self, sample_data):
        """Test visualization with custom configuration."""
        config = AnalysisConfig(
            figure_size_default=(8, 5),
            figure_size_large=(12, 8)
        )
        
        visualizer = UserBehaviorVisualizer(config)
        
        fig = visualizer.plot_device_distribution(sample_data, show_plot=False)
        
        # Figure should use custom size
        assert fig.get_size_inches()[0] == 8
        assert fig.get_size_inches()[1] == 5
        
        plt.close(fig)


class TestVisualizerDataTypes:
    """Test visualizer with different data types and edge cases."""
    
    def test_single_device_type(self, visualizer):
        """Test plotting with single device type."""
        data = pd.DataFrame({
            'device_type': ['mobile'] * 10,
            'conversion': [0, 1] * 5,
            'page_views': range(10),
            'time_spent_minutes': range(10),
            'bounce_rate': [0.5] * 10
        })
        
        fig = visualizer.plot_device_distribution(data, show_plot=False)
        assert isinstance(fig, plt.Figure)
        plt.close(fig)
    
    def test_all_zero_conversions(self, visualizer):
        """Test plotting with all zero conversions."""
        data = pd.DataFrame({
            'device_type': ['mobile', 'desktop'] * 5,
            'conversion': [0] * 10,
            'page_views': range(10),
            'time_spent_minutes': range(10),
            'bounce_rate': [0.5] * 10
        })
        
        fig = visualizer.plot_conversion_by_device(data, show_plot=False)
        assert isinstance(fig, plt.Figure)
        plt.close(fig)
    
    def test_extreme_values(self, visualizer):
        """Test plotting with extreme values."""
        data = pd.DataFrame({
            'device_type': ['mobile', 'desktop'] * 5,
            'conversion': [0, 1] * 5,
            'page_views': [1, 1000] * 5,  # Extreme values
            'time_spent_minutes': [0.1, 200] * 5,  # Extreme values
            'bounce_rate': [0, 1] * 5  # Extreme values
        })
        
        fig = visualizer.plot_engagement_distribution(data, show_plot=False)
        assert isinstance(fig, plt.Figure)
        plt.close(fig)