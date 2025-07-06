"""
AI Development Environment ML Pipeline
This module handles model training, evaluation, and deployment for the AI development environment.
"""

import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MLPipeline:
    """
    Machine Learning Pipeline for AI Development Environment
    Handles data preprocessing, model training, evaluation, and deployment
    """
    
    def __init__(self, config_path: str = "ml_config.json"):
        """
        Initialize the ML Pipeline
        
        Args:
            config_path: Path to the configuration file
        """
        self.config = self._load_config(config_path)
        self.models = {}
        self.scalers = {}
        self.metrics = {}
        
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Config file {config_path} not found, using default config")
            return self._default_config()
    
    def _default_config(self) -> Dict:
        """Default configuration"""
        return {
            "data_path": "data/",
            "model_path": "models/",
            "test_size": 0.2,
            "random_state": 42,
            "models": {
                "code_quality": {
                    "type": "classification",
                    "features": ["complexity", "lines_of_code", "comments_ratio", "test_coverage"],
                    "target": "quality_score"
                },
                "bug_prediction": {
                    "type": "classification",
                    "features": ["code_complexity", "change_frequency", "author_experience"],
                    "target": "has_bug"
                },
                "performance_prediction": {
                    "type": "regression",
                    "features": ["algorithm_complexity", "data_size", "memory_usage"],
                    "target": "execution_time"
                }
            }
        }
    
    def load_data(self, data_path: str) -> pd.DataFrame:
        """
        Load data from CSV file
        
        Args:
            data_path: Path to the data file
            
        Returns:
            DataFrame with loaded data
        """
        try:
            data = pd.read_csv(data_path)
            logger.info(f"Loaded data with shape: {data.shape}")
            return data
        except FileNotFoundError:
            logger.error(f"Data file {data_path} not found")
            raise
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise
    
    def preprocess_data(self, data: pd.DataFrame, model_name: str) -> Tuple[np.ndarray, np.ndarray]:
        """
        Preprocess data for a specific model
        
        Args:
            data: Input data
            model_name: Name of the model
            
        Returns:
            Tuple of (features, target)
        """
        model_config = self.config["models"][model_name]
        features = model_config["features"]
        target = model_config["target"]
        
        # Extract features and target
        X = data[features].values
        y = data[target].values
        
        # Handle missing values
        X = self._handle_missing_values(X)
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Store scaler for later use
        self.scalers[model_name] = scaler
        
        logger.info(f"Preprocessed data for {model_name}: X shape {X_scaled.shape}, y shape {y.shape}")
        return X_scaled, y
    
    def _handle_missing_values(self, X: np.ndarray) -> np.ndarray:
        """Handle missing values in the dataset"""
        # Simple imputation with mean
        from sklearn.impute import SimpleImputer
        imputer = SimpleImputer(strategy='mean')
        return imputer.fit_transform(X)
    
    def train_model(self, model_name: str, X: np.ndarray, y: np.ndarray) -> Dict:
        """
        Train a model
        
        Args:
            model_name: Name of the model
            X: Features
            y: Target variable
            
        Returns:
            Dictionary with training metrics
        """
        from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
        from sklearn.linear_model import LogisticRegression, LinearRegression
        
        model_config = self.config["models"][model_name]
        model_type = model_config["type"]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=self.config["test_size"], 
            random_state=self.config["random_state"]
        )
        
        # Choose model based on type
        if model_type == "classification":
            model = RandomForestClassifier(n_estimators=100, random_state=42)
        else:  # regression
            model = RandomForestRegressor(n_estimators=100, random_state=42)
        
        # Train model
        logger.info(f"Training {model_name} model...")
        model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        if model_type == "classification":
            accuracy = accuracy_score(y_test, y_pred)
            metrics = {
                "accuracy": accuracy,
                "classification_report": classification_report(y_test, y_pred, output_dict=True)
            }
        else:  # regression
            from sklearn.metrics import mean_squared_error, r2_score
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            metrics = {
                "mse": mse,
                "r2": r2,
                "rmse": np.sqrt(mse)
            }
        
        # Store model and metrics
        self.models[model_name] = model
        self.metrics[model_name] = metrics
        
        logger.info(f"Model {model_name} trained successfully")
        logger.info(f"Metrics: {metrics}")
        
        return metrics
    
    def save_model(self, model_name: str, model_path: Optional[str] = None) -> str:
        """
        Save a trained model
        
        Args:
            model_name: Name of the model
            model_path: Path to save the model (optional)
            
        Returns:
            Path where the model was saved
        """
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        
        if model_path is None:
            os.makedirs(self.config["model_path"], exist_ok=True)
            model_path = os.path.join(self.config["model_path"], f"{model_name}.pkl")
        
        # Save model and scaler
        model_data = {
            "model": self.models[model_name],
            "scaler": self.scalers.get(model_name),
            "metrics": self.metrics.get(model_name),
            "timestamp": datetime.now().isoformat()
        }
        
        joblib.dump(model_data, model_path)
        logger.info(f"Model {model_name} saved to {model_path}")
        
        return model_path
    
    def load_model(self, model_name: str, model_path: str) -> None:
        """
        Load a trained model
        
        Args:
            model_name: Name of the model
            model_path: Path to the saved model
        """
        try:
            model_data = joblib.load(model_path)
            self.models[model_name] = model_data["model"]
            self.scalers[model_name] = model_data["scaler"]
            self.metrics[model_name] = model_data["metrics"]
            
            logger.info(f"Model {model_name} loaded from {model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def predict(self, model_name: str, features: np.ndarray) -> np.ndarray:
        """
        Make predictions using a trained model
        
        Args:
            model_name: Name of the model
            features: Input features
            
        Returns:
            Predictions
        """
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        
        # Scale features
        if model_name in self.scalers:
            features_scaled = self.scalers[model_name].transform(features)
        else:
            features_scaled = features
        
        # Make predictions
        predictions = self.models[model_name].predict(features_scaled)
        
        return predictions
    
    def evaluate_model(self, model_name: str, X_test: np.ndarray, y_test: np.ndarray) -> Dict:
        """
        Evaluate a model on test data
        
        Args:
            model_name: Name of the model
            X_test: Test features
            y_test: Test target
            
        Returns:
            Dictionary with evaluation metrics
        """
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        
        # Make predictions
        y_pred = self.predict(model_name, X_test)
        
        # Calculate metrics
        model_config = self.config["models"][model_name]
        model_type = model_config["type"]
        
        if model_type == "classification":
            accuracy = accuracy_score(y_test, y_pred)
            metrics = {
                "accuracy": accuracy,
                "classification_report": classification_report(y_test, y_pred, output_dict=True)
            }
        else:  # regression
            from sklearn.metrics import mean_squared_error, r2_score
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            metrics = {
                "mse": mse,
                "r2": r2,
                "rmse": np.sqrt(mse)
            }
        
        return metrics
    
    def run_pipeline(self, data_path: str, model_name: str) -> Dict:
        """
        Run the complete ML pipeline
        
        Args:
            data_path: Path to the data
            model_name: Name of the model to train
            
        Returns:
            Dictionary with pipeline results
        """
        logger.info(f"Starting ML pipeline for {model_name}")
        
        # Load data
        data = self.load_data(data_path)
        
        # Preprocess data
        X, y = self.preprocess_data(data, model_name)
        
        # Train model
        metrics = self.train_model(model_name, X, y)
        
        # Save model
        model_path = self.save_model(model_name)
        
        results = {
            "model_name": model_name,
            "metrics": metrics,
            "model_path": model_path,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"ML pipeline completed for {model_name}")
        return results

# Example usage
if __name__ == "__main__":
    # Create pipeline
    pipeline = MLPipeline()
    
    # Example: Train code quality model
    # pipeline.run_pipeline("data/code_quality.csv", "code_quality")
