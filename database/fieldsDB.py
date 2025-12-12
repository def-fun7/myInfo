"""
fieldsDB.py
-----------
SQLite database helper for fields_database.

Provides functions to create the database schema, and to add, update,
delete, and query fields. Uses NumPy-style docstrings for clarity.
"""

import sqlite3
from pathlib import Path
import os
import gspread

os.chdir(os.path.dirname(os.path.abspath(__file__)))

DB_NAME = os.path.join(os.path.dirname(__file__), "fields_database.db")
SCHEMA_FILE = Path("sql/create_fieldsDB.sql")

def get_connection():
    """
    Create a connection to the SQLite database.

    Returns
    -------
    conn : sqlite3.Connection
        Connection object to the SQLite database.
    """
    return sqlite3.connect(DB_NAME)


def init_db():
    """
    Initialize the database schema if it does not already exist.

    Checks whether the database file exists. If not, reads the schema
    from `sql/create_fieldsDB.sql` and executes it.

    Returns
    -------
    None
    """
    db_file = Path(DB_NAME)
    if db_file.exists():
        print("Database already exists, skipping initialization.")
        return

    conn = get_connection()
    cursor = conn.cursor()

    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    cursor.executescript(schema_sql)
    conn.commit()
    conn.close()
    print("Database created successfully.")
    dataFromSheets()
    print('Data From Google Sheets added to the Database')
    
def add_field(category, subcategory, name, datatype, rules, formats, sensitivity, multiplicity):
    """
    Insert a new field into the database.

    Parameters
    ----------
    category : str
        One of: 'Personal', 'Education', 'Work', 'Finance', 'Social'.
    subcategory : str
        Subcategory string.
    name : str
        Field name.
    datatype : str
        SQLite datatype ('NULL', 'INTEGER', 'REAL', 'TEXT', 'BLOB').
    rules : str
        JSON string or text describing validation rules.
    formats : str
        JSON string or text describing formatting options.
    sensitivity : str
        One of: 'low', 'medium', 'high'.
    multiplicity : int
        Boolean-like integer (0 or 1).

    Returns
    -------
    None
    """
    conn = get_connection()
    cursor = conn.cursor()
    try: 
        cursor.execute("""
        INSERT INTO database (category, subcategory, name, datatype, rules, formats, sensitivity, multiplicity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (category, subcategory, name, datatype, rules, formats, sensitivity, multiplicity))
        print("Field added successfully.")
    
    except sqlite3.IntegrityError as e:
        raise ValueError  ("Field with this name and / or exact props already exists.") from e
    conn.commit()
    conn.close()


def update_field(field_id, **kwargs):
    """
    Update a field by ID.

    Parameters
    ----------
    field_id : int
        ID of the field to update.
    **kwargs : dict
        Column-value pairs to update. Example: name="New Name", sensitivity="low".

    Returns
    -------
    None
    """
    if not kwargs:
        return

    conn = get_connection()
    cursor = conn.cursor()

    columns = ", ".join([f"{col}=?" for col in kwargs.keys()])
    values = list(kwargs.values())
    values.append(field_id)

    sql = f"UPDATE database SET {columns} WHERE id=?"
    cursor.execute(sql, values)

    conn.commit()
    conn.close()


def delete_field(field_id):
    """
    Delete a field by ID.

    Parameters
    ----------
    field_id : int
        ID of the field to delete.

    Returns
    -------
    None
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM database WHERE id=?", (field_id,))
    conn.commit()
    conn.close()


def get_all_fields():
    """
    Retrieve all fields from the database.

    Returns
    -------
    rows : list of tuple
        List of rows, each row is a tuple representing a record.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM database")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # column names
    conn.close()
    return    [dict(zip(columns, row)) for row in rows]


def get_fields_by_category(category):
    """
    Retrieve fields filtered by category.

    Parameters
    ----------
    category : str
        Category to filter by.

    Returns
    -------
    rows : list of tuple
        List of rows matching the category.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM database WHERE category=?", (category,))
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_field_by_id(field_id):
    """
    Retrieve a single field by ID.

    Parameters
    ----------
    field_id : int
        ID of the field.

    Returns
    -------
    row : tuple or None
        Row representing the field, or None if not found.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM database WHERE id=?", (field_id,))
    row = cursor.fetchone()
    conn.close()
    return row


def dataFromSheets():
    if Path('../credientials.json').exists() is True:
        gc = gspread.service_account(filename='../credientials.json')

        sheet_url = 'https://docs.google.com/spreadsheets/d/1K1De6CBlEXe-S3qB3ywr3TqQpyRtdJW_UV7eubHpCXw/edit?usp=sharing'
        spreadsheet = gc.open_by_url(sheet_url)

        # 3. Select a worksheet (e.g., the first tab)
        worksheet = spreadsheet.sheet1 

        # --- Reading Data ---
        data_as_list = worksheet.get_all_records() # Reads all data into a list of dictionaries
        
    for item in data_as_list:
        add_field(
        category=item['Category'],
        subcategory=item['Sub-Category'],
        name=item['Name'],
        datatype=item['Data-Type'],    # Uses the 'Data-Type' key from the dictionary
        rules=item['Rules'],
        formats=item['Format'],        # Uses the 'Format' key from the dictionary
        sensitivity=item['Sensitivity'],
        multiplicity=item['Multiplicity']
    )


# -------------------------------
# Example usage
# -------------------------------
if __name__ == "__main__":
    # Initialize schema if needed
    
    # Print all fields
    # print(get_all_fields())
    pass