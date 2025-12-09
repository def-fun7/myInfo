# ERD Diagram

<!-- ![Database ERD](./database/fields_database.png) -->

```mermaid
erDiagram
    fields {
        INTEGER id PK "AUTOINC"
        TEXT category "enum: Personal, Education, Work, Finance, Social"
        TEXT subcategory
        TEXT name
        TEXT datatype "enum: SQLite datatypes"
        TEXT rules "TEXT list"
        TEXT formats "TEXT list"
        TEXT sensitivity "enum: low, medium, high"
        BOOLEAN multiplicity
    }

