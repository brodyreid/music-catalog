ALTER TABLE project_collaborators
ADD FOREIGN KEY (project_id)
REFERENCES projects(project_id)
ON DELETE CASCADE;

ALTER TABLE project_collaborators
ADD FOREIGN KEY (person_id)
REFERENCES people(person_id)
ON DELETE CASCADE;