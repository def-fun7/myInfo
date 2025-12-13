import json
import os
from database.userData import get_data_filepath 
from platformdirs import user_desktop_dir
from pathlib import Path

# --- Configuration ---

# Path to the user data JSON file (retrieved from an external function)
JSON_FILE_PATH = get_data_filepath() 

# Path to the HTML template used for generating the static page
HTML_TEMPLATE_NAME = 'myInfoUserHTML.html' 
# Determine the directory where the current Python file resides (for the template)
SCRIPT_DIR = Path(__file__).parent 
HTML_TEMPLATE_PATH = SCRIPT_DIR / HTML_TEMPLATE_NAME

# Default output filename on the desktop
DEFAULT_OUTPUT_FILENAME = 'myInfo.html'

# ----------------------------------------------------------------------

def load_data_from_json(file_path: str) -> dict or None:
    """
    Loads data from the user's JSON file.

    Parameters
    ----------
    file_path : str
        The full path to the JSON file.

    Returns
    -------
    dict or None
        The dictionary loaded from the JSON file, or None if an error occurs.
    """
    if not os.path.exists(file_path):
        print(f"Error: JSON file not found at {file_path}")
        return None
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading JSON data: {e}")
        return None

def create_dynamic_field_details(key: str) -> tuple[str, str]:
    """
    Creates the display label and search terms from the JSON key.

    Parameters
    ----------
    key : str
        The JSON key (e.g., "Father Name").

    Returns
    -------
    tuple[str, str]
        A tuple containing the display label (e.g., "Father Name:") and 
        search terms (e.g., "father name").
    """
    # Create the Display Label (e.g., "Father Name:")
    label = f"{key}:"
    
    # Create Search Terms (e.g., "father name")
    search_terms = key.lower().replace(' ', ' ')
    
    return label, search_terms


def generate_info_list_html() -> str:
    """
    Reads JSON data and dynamically generates the HTML string for the info-list 
    to be inserted into the template.

    Returns
    -------
    str
        The HTML string containing all 'info-item' divs.
    """
    user_data = load_data_from_json(JSON_FILE_PATH)
    
    if user_data is None:
        # Return an empty list or an error message if data could not be loaded
        return '' 
    
    html_parts = []
    
    # Iterate through every key-value pair in the JSON
    for key, value in user_data.items():
        
        # Get dynamic display and search data
        label, search_terms = create_dynamic_field_details(key)
        
        # Ensure value is treated as a string for HTML
        value_str = str(value)
        
        # HTML Structure (using vertical ellipsis '&#x22EE;' and copy icon '&#x1F4C4;')
        item_html = f"""
        <div class="info-item" data-search-terms="{search_terms}">
            <span class="info-label">{label}</span>
            <span class="info-value">{value_str}</span>
            <div class="copy-actions">
                <button class="copy-btn" data-value="{value_str}">&#x1F4C4;</button>
            
                <button class="menu-btn" onclick="toggleMenu(this)">&#x22EE;</button>
            
                <div class="format-menu">
                    <div class="menu-option" data-format="upper">ALL CAPS</div>
                    <div class="menu-option" data-format="lower">all small</div>
                    <div class="menu-option" data-format="nospace">No spaces</div>
                    <div class="menu-option" data-format="nospecial">No special characters</div>
                </div>
            </div>
        </div>
        """
        html_parts.append(item_html)
        
    return "\n".join(html_parts)


def create_static_info_page(output_filepath: Path) -> bool:
    """
    Reads the HTML template, inserts the dynamic content into the #info-list div,
    and saves the complete page to a new static file.

    Parameters
    ----------
    output_filepath : Path
        The full Path object where the completed HTML file should be saved.

    Returns
    -------
    bool
        True on success, False otherwise.
    """
    try:
        # 1. Read the HTML template
        with open(HTML_TEMPLATE_PATH, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print(f"Error: HTML template not found at {HTML_TEMPLATE_PATH}")
        return False
    
    # 2. Get the dynamically generated list of info items
    info_list_html = generate_info_list_html()
    
    # 3. Find and replace the content within the #info-list div
    start_tag = '<div id="info-list">'
    end_tag = '</div>'
    
    start_index = html_content.find(start_tag)
    # Search for the closing tag starting *after* the opening tag
    end_index = html_content.find(end_tag, start_index + len(start_tag)) 
    
    if start_index == -1 or end_index == -1:
        print("Error: Could not find <div id=\"info-list\"> in the HTML template.")
        return False
        
    # Inject the generated list content between the start tag and the end tag
    final_content = html_content[:start_index + len(start_tag)] + \
                    '\n' + info_list_html + '\n' + \
                    html_content[end_index:]
    
    # 4. Save the modified HTML to the new file
    try:
        # Use Path object for clean saving
        output_filepath.write_text(final_content, encoding='utf-8')
        print(f"Success! Static page saved to {output_filepath}")
        return True
    except Exception as e:
        print(f"Error saving file: {e}")
        return False


# --- EEL EXPOSED FUNCTION ---

# You must import eel and expose this function
# import eel 
# @eel.expose
def createMyInfoPage() -> dict:
    """
    Generates the static HTML copy page and saves it to the user's desktop.

    Returns
    -------
    dict
        A status dictionary containing 'status' ('success' or 'error') and a 
        descriptive 'message'.
    """
    try:
        desktop_dir = user_desktop_dir()
        
        # Construct the full Path object for the output file on the desktop
        output_filepath = Path(desktop_dir) / DEFAULT_OUTPUT_FILENAME
        
        # Call the core saving logic
        success = create_static_info_page(output_filepath)
        
        if success:
            return {"status": "success", "message": f"Page created on your Desktop: {output_filepath}"}
        else:
            return {"status": "error", "message": "Failed to create the page. See console for details."}
            
    except Exception as e:
        return {"status": "error", "message": f"An unexpected error occurred: {e}"}