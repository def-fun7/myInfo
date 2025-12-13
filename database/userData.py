import json
import os
from platformdirs import user_data_dir 

# --- Configuration ---
APP_NAME = "myInfo"  # IMPORTANT: Replace with your application's name
APP_AUTHOR = "def-fun"  # IMPORTANT: Replace with your name/company name
JSON_FILENAME = "userData.json"

def get_data_filepath():
    """
    Returns the absolute path to the JSON file in a persistent location.
    Creates the necessary directories if they don't exist.
    """
    # 1. Get the OS-appropriate base path (e.g., C:\Users\...\AppData\Local\YourEelApp)
    data_dir = user_data_dir(
        appname=APP_NAME, 
        appauthor=APP_AUTHOR, 
        version="1.0" # Optional: Use app version for better management
    )
    
    # 2. Ensure the directory exists
    os.makedirs(data_dir, exist_ok=True)
    
    # 3. Combine the directory and filename
    full_path = os.path.join(data_dir, JSON_FILENAME)
    
    return full_path

def updateUserData(new_data: str) -> dict:
    """
    Reads existing user data, merges new data, and updates the file 
    only if changes were made.

    Parameters
    ----------
    new_data : str
        A JSON string containing the new key-value pairs to merge into 
        the existing user data.

    Returns
    -------
    dict
        A status dictionary containing 'status' ('success', 'error', or 'unchanged') 
        and a descriptive 'message'.
    """
    # NOTE: These paths/functions should be available in your Python script context
    file_path = get_data_filepath()
    
    try:
        # Load the new data string from the JavaScript side
        new_json_data = json.loads(new_data)
        
        # --- 1. READ EXISTING DATA ---
        # Assuming getUserData() returns the raw JSON string from the file
        existing_data = json.loads(getUserData())
        
        # --- 2. MODIFY (MERGE) DATA ---
        
        # Create a deep copy of the original data to compare against later
        original_data = existing_data.copy()
        
        # Merge the new data into the existing data dictionary
        # This adds new keys and overwrites existing ones
        existing_data.update(new_json_data)

        # --- 3. CHECK FOR CHANGE & WRITE ---
        
        if existing_data != original_data:
            # Data has changed; write back to the file
            print(f"Data changed. Writing updated data to '{file_path}'...")
            
            with open(file_path, 'w', encoding='utf-8') as f:
                # Use indent=4 for human-readable formatting
                json.dump(existing_data, f, indent=4)
            
            print("Update complete.")
            return {"status": "success", "message": "User data successfully updated and saved."}
        else:
            # No changes were found
            print("No new or changed data found. File remains unchanged.")
            return {"status": "unchanged", "message": "No changes detected. Data file was not modified."}

    except json.JSONDecodeError:
        return {"status": "error", "message": "Invalid JSON data received from frontend."}
    except FileNotFoundError:
        return {"status": "error", "message": f"Data file not found at {file_path}."}
    except Exception as e:
        return {"status": "error", "message": f"An unexpected error occurred during update: {e}"}
    
def getUserData():
    file_path = get_data_filepath()
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

print(get_data_filepath())