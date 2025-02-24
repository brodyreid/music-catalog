-- Down migration
-- First create the old table structure back
CREATE TABLE album_projects_new (
    album_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    position INTEGER,
    PRIMARY KEY (album_id, project_id),
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Copy the data back
INSERT INTO album_projects_new (album_id, project_id, position)
SELECT album_id, project_id, position 
FROM album_projects;

-- Drop the current table
DROP TABLE album_projects;

-- Rename the new table to the original name
ALTER TABLE album_projects_new RENAME TO album_projects;