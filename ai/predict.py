import sys
import json
import os
from train_model import ExoplanetClassifier

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
        
        # Initialize classifier
        classifier = ExoplanetClassifier()
        
        # Make prediction
        result = classifier.predict(input_data)
        
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

