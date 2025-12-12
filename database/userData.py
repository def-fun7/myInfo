import json
import os

def updateUserData(file_path, new_data):
    """
    Reads existing data from a JSON file, merges new data, 
    and writes back only if changes were made.
    """
    
    new_json_data = json.loads(new_data)
    # --- 1. READ EXISTING DATA ---
    
    existing_data = json.loads(getUserData(file_path))
    # --- 2. MODIFY (MERGE) DATA ---
    
    # We create a copy of the existing data to compare against later
    original_data = existing_data.copy()
    
    # This is the standard way to merge one dictionary into another.
    # New keys are added, and existing keys are overwritten.
    
    existing_data.update(new_json_data)

    
    # --- 3. CHECK FOR CHANGE & WRITE ---
    
    # Only write back to the file if the data has actually changed
    if existing_data != original_data:
        print(f"Data changed. Writing updated data to '{file_path}'...")
        with open(file_path, 'w') as f:
            # json.dump() converts the Python dictionary back to a JSON string
            json.dump(existing_data, f, indent=4)
        print("Update complete.")
    else:
        print("No new or changed data found. File remains unchanged.")



def getUserData(file_path):
    try:
        # Check if the file exists and is not empty
        if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
            with open(file_path, 'r') as f:
                existing_data = json.load(f)
        else:
            # If file is new or empty, start with an empty dictionary
            existing_data = {}
    except json.JSONDecodeError:
        print(f"Error: Existing file '{file_path}' contains invalid JSON. Starting fresh.")
        existing_data = {}
        
    return json.dumps(existing_data)