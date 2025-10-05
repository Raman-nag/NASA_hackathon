import sys
import json
import os
from new_exoplanet_system import data_handler, get_columns, analyze_exoplanet

def main():
    try:
        # Initialize the system if not already done
        if not data_handler.is_trained:
            if not data_handler.load_data():
                print(json.dumps({
                    "error": "Failed to load data",
                    "type": "error"
                }))
                return
            
            if not data_handler.train_model():
                print(json.dumps({
                    "error": "Failed to train model", 
                    "type": "error"
                }))
                return
        
        # Get command line arguments
        if len(sys.argv) < 2:
            print(json.dumps({
                "error": "No input data provided",
                "type": "error"
            }))
            return
        
        # Parse input data
        input_data = json.loads(sys.argv[1])
        
        # Extract user inputs and selected columns
        user_inputs = input_data.get('user_inputs', {})
        selected_columns = input_data.get('selected_columns', [])
        
        if not user_inputs or not selected_columns:
            print(json.dumps({
                "error": "Missing user_inputs or selected_columns",
                "type": "error"
            }))
            return
        
        # Perform analysis
        result = analyze_exoplanet(user_inputs, selected_columns)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "error": f"Prediction failed: {str(e)}",
            "type": "error"
        }))

if __name__ == "__main__":
    main()
