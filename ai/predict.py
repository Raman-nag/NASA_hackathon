import sys
import json
import os
import joblib
import numpy as np

def load_model_artifacts():
    """Load the trained model and preprocessing artifacts."""
    try:
        # Load the trained model
        model = joblib.load('models/exoplanet_classifier.pkl')
        
        # Load the scaler
        scaler = joblib.load('models/scaler.pkl')
        
        # Load the label encoder
        label_encoder = joblib.load('models/label_encoder.pkl')
        
        # Load metadata
        with open('models/model_metadata.json', 'r') as f:
            metadata = json.load(f)
        
        return model, scaler, label_encoder, metadata
    except Exception as e:
        print(f"Error loading model artifacts: {e}", file=sys.stderr)
        return None, None, None, None

def prepare_features(input_data, feature_names):
    """Prepare input features in the correct order and format."""
    # Map input data to the expected feature names
    feature_mapping = {
        'orbital_period': 'koi_period',
        'transit_duration': 'koi_duration', 
        'planetary_radius': 'koi_prad',
        'transit_depth': 'koi_depth',
        'stellar_temperature': 'koi_steff',
        'stellar_radius': 'koi_srad',
        'stellar_surface_gravity': 'koi_slogg'
    }
    
    # Create feature array in the correct order
    features = []
    for feature_name in feature_names:
        # Find the corresponding input key
        input_key = None
        for input_key_name, model_feature_name in feature_mapping.items():
            if model_feature_name == feature_name:
                input_key = input_key_name
                break
        
        if input_key and input_key in input_data:
            features.append(float(input_data[input_key]))
        else:
            # Use default values if feature is missing
            default_values = {
                'koi_period': 10.0,
                'koi_duration': 3.0,
                'koi_prad': 1.0,
                'koi_depth': 1000.0,
                'koi_steff': 5778.0,
                'koi_srad': 1.0,
                'koi_slogg': 4.4
            }
            features.append(default_values.get(feature_name, 0.0))
    
    return np.array(features).reshape(1, -1)

def predict_exoplanet(input_data):
    """Make prediction using the trained model."""
    try:
        # Load model artifacts
        model, scaler, label_encoder, metadata = load_model_artifacts()
        
        if model is None:
            return {
                "classification": "Planetary Candidate",
                "confidence": 0.75,
                "error": "Model not available"
            }
        
        # Prepare features
        feature_names = metadata['feature_names']
        features = prepare_features(input_data, feature_names)
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make prediction
        prediction_proba = model.predict_proba(features_scaled)[0]
        prediction_class = model.predict(features_scaled)[0]
        
        # Get class name
        class_name = label_encoder.inverse_transform([prediction_class])[0]
        
        # Get confidence (max probability)
        confidence = float(np.max(prediction_proba))
        
        # Map class names to expected format
        class_mapping = {
            'CONFIRMED': 'Confirmed Exoplanet',
            'CANDIDATE': 'Planetary Candidate', 
            'FALSE POSITIVE': 'False Positive'
        }
        
        classification = class_mapping.get(class_name, 'Planetary Candidate')
        
        return {
            "classification": classification,
            "confidence": confidence,
            "probabilities": {
                "Confirmed Exoplanet": float(prediction_proba[1]),  # CONFIRMED
                "Planetary Candidate": float(prediction_proba[0]),  # CANDIDATE
                "False Positive": float(prediction_proba[2])        # FALSE POSITIVE
            }
        }
        
    except Exception as e:
        return {
            "classification": "Planetary Candidate",
            "confidence": 0.75,
            "error": str(e)
        }

def main():
    try:
        # Get input data from command line argument
        if len(sys.argv) < 2:
            print(json.dumps({
                "classification": "Planetary Candidate",
                "confidence": 0.75,
                "error": "No input data provided"
            }))
            return
        
        # Parse input data
        input_data = json.loads(sys.argv[1])
        
        # Make prediction
        result = predict_exoplanet(input_data)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        # Fallback prediction in case of error
        print(json.dumps({
            "classification": "Planetary Candidate",
            "confidence": 0.75,
            "error": str(e)
        }))

if __name__ == "__main__":
    main()