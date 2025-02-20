DROP TABLE IF EXISTS projects_search;

CREATE VIRTUAL TABLE projects_search
USING fts5(title, "path", release_name, content=projects, content_rowid=id);

INSERT INTO projects_search (rowid, title, path, release_name)
SELECT id, title, path, release_name FROM projects;

REINDEX projects_search;