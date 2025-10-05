import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import warnings
warnings.filterwarnings('ignore')

class ExoplanetDataHandler:
    def __init__(self, csv_path='training_data.csv'):
        self.csv_path = csv_path
        self.df = None
        self.model = None
        self.scaler = StandardScaler()
        self.knn = NearestNeighbors(n_neighbors=6, metric='euclidean')
        self.label_encoder = LabelEncoder()
        self.feature_columns = []
        self.target_column = None
        self.is_trained = False
        self.last_modified = None
        self._model_cache = {}
        self._data_cache = None
        self._cache_timestamp = 0
        
    def load_data(self):
        """Load and preprocess the CSV data"""
        try:
            if not os.path.exists(self.csv_path):
                print(f"Warning: {self.csv_path} not found. Creating sample data...")
                self._create_sample_data()
                return
            
            print(f"Loading data from {self.csv_path}...")
            self.df = pd.read_csv(self.csv_path)
            
            # Clean the data
            self.df = self.df.dropna(how='all')  # Remove completely empty rows
            
            # Identify potential target columns (exoplanet classification)
            potential_targets = ['pl_controv_flag', 'discoverymethod', 'rv_flag', 'tran_flag']
            self.target_column = None
            
            for col in potential_targets:
                if col in self.df.columns and self.df[col].notna().sum() > 0:
                    self.target_column = col
                    break
            
            # If no clear target, create one based on discovery method
            if self.target_column is None:
                if 'discoverymethod' in self.df.columns:
                    # Create binary classification: confirmed vs candidate
                    self.df['exoplanet_status'] = self.df['discoverymethod'].apply(
                        lambda x: 'Confirmed' if pd.notna(x) and 'Radial Velocity' in str(x) else 'Candidate'
                    )
                    self.target_column = 'exoplanet_status'
                else:
                    # Create synthetic target based on orbital period and radius
                    self.df['exoplanet_status'] = 'Candidate'
                    if 'pl_orbper' in self.df.columns and 'pl_rade' in self.df.columns:
                        confirmed_mask = (
                            (self.df['pl_orbper'].notna()) & 
                            (self.df['pl_rade'].notna()) & 
                            (self.df['pl_orbper'] > 0) & 
                            (self.df['pl_rade'] > 0)
                        )
                        self.df.loc[confirmed_mask, 'exoplanet_status'] = 'Confirmed'
                    self.target_column = 'exoplanet_status'
            
            # Select numeric columns for features
            numeric_columns = self.df.select_dtypes(include=[np.number]).columns.tolist()
            
            # Remove columns with too many missing values
            self.feature_columns = []
            for col in numeric_columns:
                if col != self.target_column and self.df[col].notna().sum() > len(self.df) * 0.1:  # At least 10% non-null
                    self.feature_columns.append(col)
            
            # Fill missing values with median
            for col in self.feature_columns:
                self.df[col] = self.df[col].fillna(self.df[col].median())
            
            print(f"Loaded {len(self.df)} records with {len(self.feature_columns)} features")
            print(f"Target column: {self.target_column}")
            print(f"Feature columns: {self.feature_columns[:10]}...")  # Show first 10
            
            return True
            
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def _create_sample_data(self):
        """Create sample data if CSV doesn't exist"""
        np.random.seed(42)
        n_samples = 1000
        
        data = {
            'pl_orbper': np.random.exponential(100, n_samples),
            'pl_rade': np.random.lognormal(0, 1, n_samples),
            'pl_bmasse': np.random.lognormal(0, 1, n_samples),
            'st_teff': np.random.normal(5500, 1000, n_samples),
            'st_rad': np.random.lognormal(0, 0.5, n_samples),
            'st_mass': np.random.lognormal(0, 0.3, n_samples),
            'sy_dist': np.random.exponential(50, n_samples),
            'pl_insol': np.random.exponential(1000, n_samples),
            'pl_eqt': np.random.normal(300, 100, n_samples),
            'st_met': np.random.normal(0, 0.3, n_samples)
        }
        
        self.df = pd.DataFrame(data)
        self.df['exoplanet_status'] = np.random.choice(['Confirmed', 'Candidate'], n_samples, p=[0.3, 0.7])
        self.target_column = 'exoplanet_status'
        self.feature_columns = list(data.keys())
        
        # Save sample data
        self.df.to_csv(self.csv_path, index=False)
        print(f"Created sample data with {n_samples} records")
    
    def train_model(self):
        """Train the Random Forest model"""
        if self.df is None or len(self.df) == 0:
            print("No data available for training")
            return False
        
        try:
            # Prepare features and target
            X = self.df[self.feature_columns].values
            y = self.df[self.target_column].values
            
            # Encode target labels
            y_encoded = self.label_encoder.fit_transform(y)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train Random Forest
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                class_weight='balanced'
            )
            
            self.model.fit(X_train_scaled, y_train)
            
            # Train KNN for similarity search
            self.knn.fit(X_train_scaled)
            
            # Evaluate model
            y_pred = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            print(f"Model trained successfully!")
            print(f"Accuracy: {accuracy:.4f}")
            print(f"Classes: {self.label_encoder.classes_}")
            
            self.is_trained = True
            
            # Save model artifacts
            self.save_model()
            
            return True
            
        except Exception as e:
            print(f"Error training model: {e}")
            return False
    
    def save_model(self):
        """Save the trained model and artifacts"""
        try:
            os.makedirs('models', exist_ok=True)
            
            joblib.dump(self.model, 'models/rf_classifier.pkl')
            joblib.dump(self.scaler, 'models/scaler.pkl')
            joblib.dump(self.knn, 'models/knn_model.pkl')
            joblib.dump(self.label_encoder, 'models/label_encoder.pkl')
            
            # Save metadata
            metadata = {
                'feature_columns': self.feature_columns,
                'target_column': self.target_column,
                'class_names': self.label_encoder.classes_.tolist(),
                'n_features': len(self.feature_columns),
                'n_samples': len(self.df),
                'trained_at': time.time()
            }
            
            with open('models/metadata.json', 'w') as f:
                json.dump(metadata, f, indent=2)
            
            print("Model artifacts saved successfully!")
            
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def load_model(self):
        """Load the trained model and artifacts"""
        try:
            if not os.path.exists('models/rf_classifier.pkl'):
                print("No trained model found")
                return False
            
            self.model = joblib.load('models/rf_classifier.pkl')
            self.scaler = joblib.load('models/scaler.pkl')
            self.knn = joblib.load('models/knn_model.pkl')
            self.label_encoder = joblib.load('models/label_encoder.pkl')
            
            with open('models/metadata.json', 'r') as f:
                metadata = json.load(f)
                self.feature_columns = metadata['feature_columns']
                self.target_column = metadata['target_column']
            
            self.is_trained = True
            print("Model loaded successfully!")
            return True
            
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def find_exact_match(self, user_inputs, selected_columns):
        """Find exact match in the dataset"""
        if self.df is None:
            return None
        
        try:
            # Create mask for exact match
            mask = pd.Series([True] * len(self.df))
            
            for col, value in user_inputs.items():
                if col in self.df.columns:
                    if pd.api.types.is_numeric_dtype(self.df[col]):
                        # For numeric columns, allow small tolerance
                        mask &= (abs(self.df[col] - float(value)) < 1e-6)
                    else:
                        # For categorical columns, exact match
                        mask &= (self.df[col].astype(str) == str(value))
            
            if mask.any():
                match_idx = mask.idxmax()
                match_record = self.df.iloc[match_idx].to_dict()
                
                # Return all columns except the selected ones
                result_columns = [col for col in self.df.columns if col not in selected_columns]
                return {
                    'found': True,
                    'record': {col: match_record[col] for col in result_columns},
                    'index': match_idx
                }
            
            return {'found': False}
            
        except Exception as e:
            print(f"Error in exact match: {e}")
            return {'found': False, 'error': str(e)}
    
    def find_nearest_neighbors(self, user_inputs, selected_columns, k=6):
        """Find k nearest neighbors using KNN"""
        if not self.is_trained or self.df is None:
            return {'error': 'Model not trained or data not loaded'}
        
        try:
            # Prepare input features
            input_features = []
            for col in self.feature_columns:
                if col in user_inputs:
                    input_features.append(float(user_inputs[col]))
                else:
                    # Use median value for missing features
                    input_features.append(self.df[col].median())
            
            input_features = np.array(input_features).reshape(1, -1)
            input_scaled = self.scaler.transform(input_features)
            
            # Find nearest neighbors
            distances, indices = self.knn.kneighbors(input_scaled, n_neighbors=k)
            
            neighbors = []
            for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
                neighbor_record = self.df.iloc[idx].to_dict()
                similarity_score = 1 / (1 + dist)  # Convert distance to similarity
                
                neighbors.append({
                    'index': idx,
                    'similarity_score': float(similarity_score),
                    'distance': float(dist),
                    'record': neighbor_record
                })
            
            return {'neighbors': neighbors}
            
        except Exception as e:
            print(f"Error in nearest neighbors: {e}")
            return {'error': str(e)}
    
    def predict_classification(self, user_inputs, selected_columns):
        """Predict exoplanet classification using Random Forest"""
        if not self.is_trained:
            return {'error': 'Model not trained'}
        
        try:
            # Prepare input features
            input_features = []
            for col in self.feature_columns:
                if col in user_inputs:
                    input_features.append(float(user_inputs[col]))
                else:
                    # Use median value for missing features
                    input_features.append(self.df[col].median())
            
            input_features = np.array(input_features).reshape(1, -1)
            input_scaled = self.scaler.transform(input_features)
            
            # Make prediction
            prediction_proba = self.model.predict_proba(input_scaled)[0]
            prediction_class = self.model.predict(input_scaled)[0]
            
            # Get class name
            class_name = self.label_encoder.inverse_transform([prediction_class])[0]
            confidence = float(np.max(prediction_proba))
            
            # Create probability dictionary
            probabilities = {}
            for i, class_name_encoded in enumerate(self.label_encoder.classes_):
                probabilities[class_name_encoded] = float(prediction_proba[i])
            
            return {
                'classification': class_name,
                'confidence': confidence,
                'probabilities': probabilities
            }
            
        except Exception as e:
            print(f"Error in classification: {e}")
            return {'error': str(e)}
    
    def get_column_info(self):
        """Get information about available columns with caching"""
        current_time = time.time()
        
        # Check if we have cached data that's still valid (5 minutes)
        if (self._data_cache is not None and 
            (current_time - self._cache_timestamp) < 300):
            return self._data_cache
        
        if self.df is None:
            return {'columns': [], 'error': 'Data not loaded'}
        
        columns_info = []
        for col in self.df.columns:
            col_info = {
                'name': col,
                'type': str(self.df[col].dtype),
                'non_null_count': int(self.df[col].notna().sum()),
                'null_count': int(self.df[col].isna().sum()),
                'is_numeric': pd.api.types.is_numeric_dtype(self.df[col])
            }
            
            if col_info['is_numeric'] and col_info['non_null_count'] > 0:
                col_info['min'] = float(self.df[col].min())
                col_info['max'] = float(self.df[col].max())
                col_info['mean'] = float(self.df[col].mean())
                col_info['median'] = float(self.df[col].median())
            
            columns_info.append(col_info)
        
        result = {'columns': columns_info}
        
        # Cache the result
        self._data_cache = result
        self._cache_timestamp = current_time
        
        return result
    
    def clear_cache(self):
        """Clear all caches"""
        self._model_cache = {}
        self._data_cache = None
        self._cache_timestamp = 0

class FileWatcher(FileSystemEventHandler):
    def __init__(self, data_handler):
        self.data_handler = data_handler
        self.last_modified = None
    
    def on_modified(self, event):
        if event.is_directory:
            return
        
        if event.src_path.endswith('.csv'):
            current_time = time.time()
            if self.last_modified and (current_time - self.last_modified) < 5:
                return  # Avoid multiple triggers
            
            self.last_modified = current_time
            print(f"CSV file modified: {event.src_path}")
            
            # Retrain model in background
            threading.Thread(target=self._retrain_model, daemon=True).start()
    
    def _retrain_model(self):
        """Retrain model when CSV is updated"""
        try:
            print("Retraining model due to CSV update...")
            # Clear cache before retraining
            self.data_handler.clear_cache()
            
            if self.data_handler.load_data():
                self.data_handler.train_model()
                print("Model retraining completed!")
            else:
                print("Failed to retrain model")
        except Exception as e:
            print(f"Error during retraining: {e}")

# Global data handler instance
data_handler = ExoplanetDataHandler()

def initialize_system():
    """Initialize the exoplanet analysis system"""
    global data_handler
    
    print("Initializing Exoplanet Analysis System...")
    
    # Load data and train model
    if data_handler.load_data():
        if data_handler.train_model():
            print("System initialized successfully!")
            
            # Start file watcher
            observer = Observer()
            event_handler = FileWatcher(data_handler)
            observer.schedule(event_handler, path='.', recursive=False)
            observer.start()
            
            return True
    
    print("Failed to initialize system")
    return False

def get_columns():
    """Get available columns from the CSV"""
    return data_handler.get_column_info()

def analyze_exoplanet(user_inputs, selected_columns):
    """Main analysis function"""
    try:
        # First, try exact match
        exact_match = data_handler.find_exact_match(user_inputs, selected_columns)
        
        if exact_match.get('found'):
            return {
                'type': 'exact_match',
                'result': exact_match['record'],
                'message': 'Exact match found in dataset!'
            }
        
        # If no exact match, use ML approach
        neighbors_result = data_handler.find_nearest_neighbors(user_inputs, selected_columns)
        classification_result = data_handler.predict_classification(user_inputs, selected_columns)
        
        if 'error' in neighbors_result or 'error' in classification_result:
            return {
                'type': 'error',
                'message': 'Analysis failed',
                'error': neighbors_result.get('error', classification_result.get('error'))
            }
        
        return {
            'type': 'ml_analysis',
            'classification': classification_result,
            'neighbors': neighbors_result['neighbors'],
            'message': 'No exact match found. Using ML analysis.'
        }
        
    except Exception as e:
        return {
            'type': 'error',
            'message': f'Analysis failed: {str(e)}'
        }

if __name__ == "__main__":
    # Initialize the system
    if initialize_system():
        print("Exoplanet Analysis System is ready!")
        print("Monitoring for CSV file changes...")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("Shutting down...")
    else:
        print("Failed to start system")
