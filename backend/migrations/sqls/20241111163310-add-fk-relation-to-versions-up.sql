ALTER TABLE versions
ADD project_id char(16);

ALTER TABLE versions
ADD FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE CASCADE;