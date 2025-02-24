-- First create the new table
CREATE TABLE album_projects_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    position INTEGER,
    UNIQUE (album_id, project_id),
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Copy the data, SQLite will auto-generate the id
INSERT INTO album_projects_new (album_id, project_id, position)
SELECT album_id, project_id, position 
FROM album_projects;

-- Drop the old table
DROP TABLE album_projects;

-- Rename the new table to the original name
ALTER TABLE album_projects_new RENAME TO album_projects;