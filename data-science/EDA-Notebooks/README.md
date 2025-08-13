# EDA & Notebooks

This project contains exploratory data analysis (EDA) notebooks and sample data for data science demonstrations. It provides a complete local development environment with PostgreSQL database integration.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- VS Code with Dev Containers extension (recommended)

### Setup with Dev Container (Recommended)

1. Open this project in VS Code
2. When prompted, click "Reopen in Container" or press `Ctrl+Shift+P` and select "Dev Containers: Reopen in Container"
3. Wait for the container to build and start
4. Run the setup verification:
   ```bash
   python setup_test.py
   ```

### Manual Setup

1. **Start the services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify setup:**
   ```bash
   python setup_test.py
   ```

## 📊 Sample Data

The project includes sample movie data:
- `sample_data/movie_logs.json` - Movie viewing logs
- `sample_data/movies_features.csv` - Movie features for ML
- `sample_data/init.sql` - PostgreSQL database initialization

## 📓 Notebooks

- `notebooks/movie_logs_dashboard.ipynb` - Interactive data exploration and visualization
- `notebooks/rf_pipeline.joblib` - Trained random forest model

## 🐘 PostgreSQL Database

The development environment includes a PostgreSQL database with:
- **Host:** localhost (or `postgres` from within container)
- **Port:** 5432
- **Database:** moviedb
- **User:** demo
- **Password:** demo123

The database is automatically initialized with sample data on first startup.

## 🔧 Development

### Running Jupyter
```bash
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root
```

### Database Connection
```python
import psycopg2
import os

conn = psycopg2.connect(
    host=os.getenv('POSTGRES_HOST', 'localhost'),
    database=os.getenv('POSTGRES_DB', 'moviedb'),
    user=os.getenv('POSTGRES_USER', 'demo'),
    password=os.getenv('POSTGRES_PASSWORD', 'demo123')
)
```

### Available Tools
- Python 3.11
- Jupyter Lab
- pandas, numpy, scikit-learn
- matplotlib, seaborn for visualization
- PostgreSQL client tools

## 🧪 Testing

Run the verification script to ensure everything is working:
```bash
python setup_test.py
```

This will test:
- Python package availability
- Database connectivity
- Sample data accessibility

## 📁 Project Structure

```
EDA-Notebooks/
├── .devcontainer/           # VS Code dev container configuration
├── notebooks/               # Jupyter notebooks
├── sample_data/            # Sample datasets and database setup
├── docker-compose.dev.yml  # Docker Compose for local development
├── Dockerfile.dev          # Development container definition
├── requirements.txt        # Python dependencies
├── setup_test.py          # Environment verification script
└── README.md              # This file
``` 