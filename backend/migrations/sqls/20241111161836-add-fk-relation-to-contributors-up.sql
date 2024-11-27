ALTER TABLE project_contributors
ADD FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE CASCADE;

ALTER TABLE project_contributors
ADD FOREIGN KEY (contributor_id)
REFERENCES contributors(id)
ON DELETE CASCADE;