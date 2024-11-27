-- Delete from versions table
DELETE FROM public.versions WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9);

-- Delete from project_contributors table
DELETE FROM public.project_contributors WHERE (project_id, contributor_id) IN 
((1, 1), (2, 1), (2, 2), (3, 1), (3, 9), (4, 1), (5, 1), (5, 2), (6, 1), (6, 2), (7, 1), (7, 3), (7, 5));

-- Delete from projects table
DELETE FROM public.projects WHERE id IN (1, 2, 3, 4, 5, 6, 7);

-- Delete from contributors table
DELETE FROM public.contributors WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9);
