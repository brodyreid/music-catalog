ALTER TABLE versions
ADD project_id integer;

ALTER TABLE versions
ADD FOREIGN KEY (project_id)
REFERENCES projects(project_id)
ON DELETE CASCADE;