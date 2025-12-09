CREATE TABLE database(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT CHECK (
        category IN (
            'Personal',
            'Education',
            'Work',
            'Finance',
            'Social'
        )
    ),
    subcategory TEXT,
    name TEXT,
    datatype TEXT CHECK (
        datatype IN (
            'NULL',
            'INTEGER',
            'REAL',
            'TEXT',
            'BLOB'
        )
    ),
    rules TEXT,
    formats TEXT,
    sensitivity TEXT CHECK (
        sensitivity IN ('low', 'medium', 'high')
    ),
    multiplicity INTEGER CHECK (multiplicity IN (0, 1)),
    UNIQUE (
        category,
        subcategory,
        name,
        datatype,
        rules,
        formats,
        sensitivity,
        multiplicity
    )
    UNIQUE (name)
);