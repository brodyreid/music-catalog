CREATE VIRTUAL TABLE projects_search
USING fts5(title, "path", release_name, content=projects, content_rowid=id);