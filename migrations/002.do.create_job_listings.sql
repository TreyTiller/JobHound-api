CREATE TYPE stage_level as ENUM ('Lead', 'Applied', 'Interviewed', 'Archived');

CREATE TABLE job_listings (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    source TEXT,
    location TEXT,
    contact TEXT,
    phone TEXT,
    email TEXT,
    stage stage_level NOT NULL,
    notes TEXT,
    listing TEXT,
    date_interviewed TEXT,
    date_appllied TEXT,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
)
