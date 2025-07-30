"""
User Behavior Analysis Package

A package for analyzing user behavior data including engagement patterns,
conversion rates, and geographic/temporal trends.
"""

from .analyzer import UserBehaviorAnalyzer
from .visualizer import UserBehaviorVisualizer
from .config import AnalysisConfig

__version__ = "0.1.0"
__author__ = "Generated from Jupyter Notebook"

__all__ = [
    "UserBehaviorAnalyzer",
    "UserBehaviorVisualizer", 
    "AnalysisConfig"
]