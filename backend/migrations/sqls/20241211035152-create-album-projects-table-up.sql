CREATE TABLE album_projects (
  album_id char(16) REFERENCES albums(id) ON DELETE SET NULL,
  project_id char(16) REFERENCES projects(id) ON DELETE SET NULL
);