-- Create musical_key enum equivalent using CHECK constraints
CREATE TABLE musical_key_enum (
    value TEXT PRIMARY KEY
) WITHOUT ROWID;
INSERT INTO musical_key_enum (value) VALUES
    ('C Major'), ('C Minor'), ('C# Major'), ('C# Minor'),
    ('D Major'), ('D Minor'), ('D# Major'), ('D# Minor'),
    ('E Major'), ('E Minor'), ('F Major'), ('F Minor'),
    ('F# Major'), ('F# Minor'), ('G Major'), ('G Minor'),
    ('G# Major'), ('G# Minor'), ('A Major'), ('A Minor'),
    ('A# Major'), ('A# Minor'), ('B Major'), ('B Minor');

-- Create the albums table
CREATE TABLE albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    notes TEXT,
    release_date TEXT
);

-- Create the contributors table
CREATE TABLE contributors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist_name TEXT NOT NULL,
    first_name TEXT
);

-- Create the projects table
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    bpm REAL,
    date_created TEXT,
    folder_path_hash TEXT NOT NULL,
    musical_key TEXT,
    notes TEXT,
    path TEXT,
    release_name TEXT,
    FOREIGN KEY (musical_key) REFERENCES musical_key_enum(value)
);

-- Create the album_projects junction table
CREATE TABLE album_projects (
    album_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    position INTEGER,
    PRIMARY KEY (album_id, project_id),
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create the project_contributors junction table
CREATE TABLE project_contributors (
    project_id INTEGER NOT NULL,
    contributor_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, contributor_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (contributor_id) REFERENCES contributors(id) ON DELETE CASCADE
);
