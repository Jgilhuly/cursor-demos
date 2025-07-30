"""
Examples of how to use the Logger class throughout your data science project.

This file demonstrates various logging patterns and best practices for
data science workflows, error handling, and general application logging.
"""

import pandas as pd
import numpy as np
from logger import get_logger, Logger
import logging


def example_basic_usage():
    """Basic logger usage example."""
    # Simple logger creation
    logger = get_logger("BasicExample")
    
    logger.info("Starting basic example")
    logger.debug("This is a debug message (won't show unless level is DEBUG)")
    logger.warning("This is a warning")
    logger.error("This is an error message")
    
    # You can also create logger with specific configuration
    custom_logger = Logger(
        name="CustomLogger",
        level=logging.DEBUG,
        log_to_file=False,  # Only console logging
        console_format="%(levelname)s: %(message)s"  # Simple format
    )
    
    custom_logger.debug("This debug message will show with custom logger")


def example_data_processing():
    """Example of logging in a data processing pipeline."""
    logger = get_logger("DataProcessing")
    
    try:
        logger.log_processing_step("Data Generation", "Creating sample dataset")
        
        # Create sample data
        data = {
            'user_id': range(1, 101),
            'age': np.random.randint(18, 80, 100),
            'score': np.random.normal(75, 15, 100),
            'category': np.random.choice(['A', 'B', 'C'], 100)
        }
        df = pd.DataFrame(data)
        
        # Log DataFrame information
        logger.log_dataframe_info(df, "Generated Dataset")
        
        logger.log_processing_step("Data Cleaning", "Handling outliers and missing values")
        
        # Simulate some data cleaning
        original_count = len(df)
        df = df[df['score'] > 30]  # Remove low scores
        removed_count = original_count - len(df)
        
        if removed_count > 0:
            logger.warning(f"Removed {removed_count} outlier records")
        
        logger.info(f"Final dataset has {len(df)} records")
        
        logger.log_processing_step("Feature Engineering", "Creating new features")
        
        # Create new features
        df['score_category'] = pd.cut(df['score'], bins=3, labels=['Low', 'Medium', 'High'])
        df['age_group'] = pd.cut(df['age'], bins=[0, 30, 50, 100], labels=['Young', 'Middle', 'Senior'])
        
        logger.info("Created score_category and age_group features")
        logger.log_dataframe_info(df, "Final Dataset")
        
        return df
        
    except Exception as e:
        logger.exception(f"Error in data processing: {e}")
        raise


def example_model_training():
    """Example of logging in a model training context."""
    logger = get_logger("ModelTraining")
    
    logger.log_processing_step("Model Training", "Training a simple classifier")
    
    try:
        # Simulate model training
        logger.info("Initializing model parameters")
        logger.info("Training epochs: 100")
        logger.info("Learning rate: 0.001")
        
        # Simulate training loop with progress logging
        for epoch in [10, 25, 50, 75, 100]:
            accuracy = 0.6 + (epoch / 100) * 0.35  # Simulate improving accuracy
            logger.info(f"Epoch {epoch}: Training accuracy = {accuracy:.3f}")
        
        final_accuracy = 0.95
        logger.info(f"Training completed. Final accuracy: {final_accuracy:.3f}")
        
        if final_accuracy > 0.9:
            logger.info("Model performance meets requirements")
        else:
            logger.warning("Model performance below target threshold")
        
    except Exception as e:
        logger.exception("Model training failed")
        raise


def example_error_handling():
    """Example of error handling with logging."""
    logger = get_logger("ErrorHandling")
    
    logger.info("Demonstrating error handling with logging")
    
    # Example 1: Handling expected errors gracefully
    try:
        # Simulate file not found
        logger.info("Attempting to load data file")
        raise FileNotFoundError("data.csv not found")
        
    except FileNotFoundError as e:
        logger.error(f"Data file not found: {e}")
        logger.info("Using default dataset instead")
    
    # Example 2: Unexpected errors with full traceback
    try:
        # Simulate unexpected error
        result = 10 / 0
        
    except Exception as e:
        logger.exception("Unexpected error occurred during calculation")
        # Note: exception() automatically includes the traceback


def example_configuration_logging():
    """Example of different logger configurations for different use cases."""
    
    # Logger for debugging (verbose, file + console)
    debug_logger = Logger(
        name="DebugLogger",
        level=logging.DEBUG,
        log_to_file=True,
        log_to_console=True,
        log_dir="debug_logs"
    )
    
    # Logger for production (less verbose, file only)
    prod_logger = Logger(
        name="ProductionLogger", 
        level=logging.INFO,
        log_to_file=True,
        log_to_console=False,
        log_dir="production_logs"
    )
    
    # Logger for analysis (custom format, console only)
    analysis_logger = Logger(
        name="AnalysisLogger",
        level=logging.INFO,
        log_to_file=False,
        log_to_console=True,
        console_format="[%(asctime)s] %(message)s"
    )
    
    debug_logger.debug("Detailed debug information")
    prod_logger.info("Production system event")
    analysis_logger.info("Analysis step completed")


if __name__ == "__main__":
    print("Running Logger Usage Examples")
    print("=" * 50)
    
    # Run examples
    example_basic_usage()
    print("\n" + "=" * 50 + "\n")
    
    df = example_data_processing()
    print("\n" + "=" * 50 + "\n")
    
    example_model_training()
    print("\n" + "=" * 50 + "\n")
    
    example_error_handling()
    print("\n" + "=" * 50 + "\n")
    
    example_configuration_logging()
    
    print("\n" + "=" * 50)
    print("All examples completed! Check the 'logs' directory for log files.")