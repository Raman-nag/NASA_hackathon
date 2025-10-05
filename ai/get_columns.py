import sys
import json
from new_exoplanet_system import data_handler, get_columns

def main():
    try:
        # Initialize the system if not already done
        if not data_handler.df is not None:
            if not data_handler.load_data():
                print(json.dumps({
                    "error": "Failed to load data",
                    "columns": []
                }))
                return
        
        # Get column information
        result = get_columns()
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "error": f"Failed to get columns: {str(e)}",
            "columns": []
        }))

if __name__ == "__main__":
    main()
