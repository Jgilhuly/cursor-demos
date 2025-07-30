"""
Logger utility for data science and general Python applications.

This module provides a configurable logger class that can be used throughout
the project for consistent logging with timestamps, levels, and both console
and file output options.
"""

import logging
import os
from datetime import datetime
from typing import Optional, Union
from pathlib import Path


class Logger:
    """
    A flexible logger class for data science and application logging.
    
    Features:
    - Multiple log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    - Console and file logging
    - Configurable formatting
    - Easy to use throughout the codebase
    - Automatic log directory creation
    """
    
    def __init__(
        self,
        name: str = "DataScienceLogger",
        level: Union[str, int] = logging.INFO,
        log_to_file: bool = True,
        log_to_console: bool = True,
        log_dir: str = "logs",
        log_filename: Optional[str] = None,
        console_format: Optional[str] = None,
        file_format: Optional[str] = None
    ):
        """
        Initialize the logger.
        
        Args:
            name: Logger name (usually module or class name)
            level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
            log_to_file: Whether to log to file
            log_to_console: Whether to log to console
            log_dir: Directory to store log files
            log_filename: Custom log filename (defaults to timestamped name)
            console_format: Custom console log format
            file_format: Custom file log format
        """
        self.name = name
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        
        # Clear any existing handlers to avoid duplicates
        self.logger.handlers.clear()
        
        # Set up formatters
        self.console_formatter = logging.Formatter(
            console_format or 
            "%(asctime)s | %(name)s | %(levelname)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        
        self.file_formatter = logging.Formatter(
            file_format or
            "%(asctime)s | %(name)s | %(levelname)s | %(filename)s:%(lineno)d | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        
        # Set up console handler
        if log_to_console:
            self._setup_console_handler()
        
        # Set up file handler
        if log_to_file:
            self._setup_file_handler(log_dir, log_filename)
    
    def _setup_console_handler(self):
        """Set up console logging handler."""
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(self.console_formatter)
        self.logger.addHandler(console_handler)
    
    def _setup_file_handler(self, log_dir: str, log_filename: Optional[str]):
        """Set up file logging handler."""
        # Create log directory if it doesn't exist
        Path(log_dir).mkdir(exist_ok=True)
        
        # Generate filename if not provided
        if not log_filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            log_filename = f"{self.name.lower()}_{timestamp}.log"
        
        log_path = os.path.join(log_dir, log_filename)
        
        file_handler = logging.FileHandler(log_path)
        file_handler.setFormatter(self.file_formatter)
        self.logger.addHandler(file_handler)
        
        # Log the log file location
        self.logger.info(f"Logging to file: {log_path}")
    
    def debug(self, message: str, *args, **kwargs):
        """Log debug message."""
        self.logger.debug(message, *args, **kwargs)
    
    def info(self, message: str, *args, **kwargs):
        """Log info message."""
        self.logger.info(message, *args, **kwargs)
    
    def warning(self, message: str, *args, **kwargs):
        """Log warning message."""
        self.logger.warning(message, *args, **kwargs)
    
    def error(self, message: str, *args, **kwargs):
        """Log error message."""
        self.logger.error(message, *args, **kwargs)
    
    def critical(self, message: str, *args, **kwargs):
        """Log critical message."""
        self.logger.critical(message, *args, **kwargs)
    
    def exception(self, message: str, *args, **kwargs):
        """Log exception with traceback."""
        self.logger.exception(message, *args, **kwargs)
    
    def log_dataframe_info(self, df, name: str = "DataFrame"):
        """
        Log useful information about a pandas DataFrame.
        
        Args:
            df: pandas DataFrame
            name: Name to identify the DataFrame in logs
        """
        self.info(f"{name} shape: {df.shape}")
        self.info(f"{name} columns: {list(df.columns)}")
        self.info(f"{name} dtypes:\n{df.dtypes}")
        self.info(f"{name} memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
        
        # Log missing values if any
        missing = df.isnull().sum()
        if missing.any():
            self.warning(f"{name} missing values:\n{missing[missing > 0]}")
    
    def log_processing_step(self, step_name: str, details: str = ""):
        """
        Log a processing step with consistent formatting.
        
        Args:
            step_name: Name of the processing step
            details: Additional details about the step
        """
        separator = "=" * 50
        self.info(f"\n{separator}")
        self.info(f"PROCESSING STEP: {step_name}")
        if details:
            self.info(f"Details: {details}")
        self.info(f"{separator}")
    
    def set_level(self, level: Union[str, int]):
        """Change the logging level."""
        self.logger.setLevel(level)
        self.info(f"Logger level set to: {logging.getLevelName(level)}")


# Convenience function to create a logger instance
def get_logger(
    name: str = None,
    level: Union[str, int] = logging.INFO,
    **kwargs
) -> Logger:
    """
    Convenience function to create a logger instance.
    
    Args:
        name: Logger name (defaults to calling module name)
        level: Logging level
        **kwargs: Additional arguments for Logger class
    
    Returns:
        Logger instance
    """
    if name is None:
        # Try to get the calling module name
        import inspect
        frame = inspect.currentframe().f_back
        name = frame.f_globals.get('__name__', 'DefaultLogger')
    
    return Logger(name=name, level=level, **kwargs)


# Example usage and demonstration
if __name__ == "__main__":
    # Create a logger instance
    logger = get_logger("ExampleLogger", level=logging.DEBUG)
    
    # Test different log levels
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")
    
    # Test DataFrame logging (if pandas is available)
    try:
        import pandas as pd
        df = pd.DataFrame({
            'A': [1, 2, 3, None],
            'B': ['x', 'y', 'z', 'w'],
            'C': [1.1, 2.2, 3.3, 4.4]
        })
        logger.log_dataframe_info(df, "Sample DataFrame")
    except ImportError:
        logger.warning("pandas not available for DataFrame logging demo")
    
    # Test processing step logging
    logger.log_processing_step("Data Loading", "Loading user data from CSV")
    logger.info("Processing complete")