import pandas as pd
import matplotlib.pyplot as plt
from logger import get_logger

# Initialize logger for this analysis
logger = get_logger("UserDataAnalysis")

logger.log_processing_step("Data Loading", "Loading user data from CSV file")
df = pd.read_csv('legacy-pandas-pipeline/user_data.csv')

# Log DataFrame information instead of just printing head
logger.info("Data loaded successfully")
logger.log_dataframe_info(df, "User Data")

logger.info("First 5 rows of the dataset:")
logger.info(f"\n{df.head().to_string()}")

logger.log_processing_step("Data Exploration", "Analyzing value counts for each column")
for column in df.columns:
    logger.info(f"Value counts for column '{column}':")
    value_counts = df[column].value_counts()
    logger.info(f"\n{value_counts.to_string()}")

    if column == "subscription_type":
        logger.info("Creating pie chart for subscription type distribution")
        value_counts.plot.pie(autopct='%1.1f%%', startangle=90, figsize=(6, 6))
        plt.title("Subscription Type Distribution")
        plt.ylabel("")
        plt.show()
        logger.info("Pie chart displayed successfully")

logger.info("Analysis completed successfully")
