import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
import joblib
import json
import os

class ExoplanetClassifier:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic exoplanet data for training"""
        np.random.seed(42)
        
        # Generate realistic exoplanet parameters
        data = []
        
        for i in range(n_samples):
            # Generate stellar parameters
            stellar_radius = np.random.uniform(0.5, 2.0)
            stellar_mass = np.random.uniform(0.5, 2.0)
            stellar_temperature = np.random.uniform(3000, 8000)
            
            # Generate orbital period (days)
            orbital_period = np.random.uniform(0.5, 1000)
            
            # Generate planetary radius (Earth radii)
            planetary_radius = np.random.uniform(0.5, 20)
            
            # Calculate transit duration based on orbital mechanics
            # Simplified transit duration calculation
            transit_duration = orbital_period * 0.1 * np.random.uniform(0.5, 2.0)
            
            # Determine classification based on physical plausibility
            # This is a simplified heuristic for synthetic data
            if planetary_radius > 15 or orbital_period < 0.1:
                classification = 'False Positive'
            elif planetary_radius > 5 and orbital_period > 100:
                classification = 'Confirmed Exoplanet'
            else:
                classification = 'Planetary Candidate'
            
            data.append({
                'orbital_period': orbital_period,
                'transit_duration': transit_duration,
                'planetary_radius': planetary_radius,
                'stellar_radius': stellar_radius,
                'stellar_mass': stellar_mass,
                'stellar_temperature': stellar_temperature,
                'classification': classification
            })
        
        return pd.DataFrame(data)
    
    def prepare_features(self, df):
        """Prepare features for training"""
        # Select relevant features
        feature_columns = [
            'orbital_period', 'transit_duration', 'planetary_radius',
            'stellar_radius', 'stellar_mass', 'stellar_temperature'
        ]
        
        X = df[feature_columns].values
        y = df['classification'].values
        
        return X, y
    
    def train(self, df=None):
        """Train the model"""
        if df is None:
            print("Generating synthetic training data...")
            df = self.generate_synthetic_data(2000)
        
        print(f"Training on {len(df)} samples")
        print(f"Class distribution:\n{df['classification'].value_counts()}")
        
        X, y = self.prepare_features(df)
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train the model
        print("Training Random Forest classifier...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate the model
        y_pred = self.model.predict(X_test_scaled)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted')
        recall = recall_score(y_test, y_pred, average='weighted')
        f1 = f1_score(y_test, y_pred, average='weighted')
        
        print(f"\nModel Performance:")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1-Score: {f1:.4f}")
        
        print(f"\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        self.is_trained = True
        
        # Save the model and scaler
        self.save_model()
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1
        }
    
    def predict(self, data):
        """Make prediction on new data"""
        if not self.is_trained:
            self.load_model()
        
        # Convert single data point to array if needed
        if isinstance(data, dict):
            feature_columns = [
                'orbital_period', 'transit_duration', 'planetary_radius',
                'stellar_radius', 'stellar_mass', 'stellar_temperature'
            ]
            X = np.array([[data.get(col, 0) for col in feature_columns]])
        else:
            X = np.array(data)
        
        # Scale the features
        X_scaled = self.scaler.transform(X)
        
        # Make prediction
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        confidence = np.max(probabilities)
        
        return {
            'classification': prediction,
            'confidence': float(confidence),
            'probabilities': {
                class_name: float(prob) 
                for class_name, prob in zip(self.model.classes_, probabilities)
            }
        }
    
    def save_model(self):
        """Save the trained model and scaler"""
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, 'models/exoplanet_classifier.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        print("Model saved successfully!")
    
    def load_model(self):
        """Load the trained model and scaler"""
        try:
            self.model = joblib.load('models/exoplanet_classifier.pkl')
            self.scaler = joblib.load('models/scaler.pkl')
            self.is_trained = True
            print("Model loaded successfully!")
        except FileNotFoundError:
            print("No trained model found. Training new model...")
            self.train()

if __name__ == "__main__":
    # Train the model
    classifier = ExoplanetClassifier()
    performance = classifier.train()
    
    # Save performance metrics
    with open('models/performance.json', 'w') as f:
        json.dump(performance, f, indent=2)

