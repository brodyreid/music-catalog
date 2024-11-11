-- Delete from versions table
DELETE FROM public.versions WHERE version_id IN (1, 2, 3, 4);

-- Delete from project_collaborators table
DELETE FROM public.project_collaborators WHERE (project_id, person_id) IN 
((1, 1), (1, 2), (2, 1), (2, 2), (3, 1), (3, 3), (4, 1));

-- Delete from projects table
DELETE FROM public.projects WHERE project_id IN (1, 2, 3, 4);

-- Delete from people table
DELETE FROM public.people WHERE person_id IN (1, 2, 3, 4);
