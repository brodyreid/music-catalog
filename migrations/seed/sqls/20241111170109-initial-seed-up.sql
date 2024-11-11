-- Insert seed data into people table
INSERT INTO public.people (person_id, "name") VALUES
(1, 'Banana Boy'),
(2, 'Jesse'),
(3, 'Alex'),
(4, 'Sam');

-- Insert seed data into projects table
INSERT INTO public.projects (project_id, project_number, title, folder_path, notes, date_created) VALUES
(1, 101, 'Summer Town Project', '/projects/2023/01/Summer_Town', 'A collaborative summer project', '2023-01-15'),
(2, 102, 'Rain Town (Population Us) Project', '/projects/2023/02/Rain_Town', 'Song project with Jesse', '2023-02-20'),
(3, 103, 'Rocking Out', '/projects/2023/03/Rocking_Out', 'Rock song with Alex', '2023-03-10'),
(4, 104, 'Solo Instrumental', '/projects/2023/04/Solo_Instrumental', 'Instrumental track', '2023-04-05');

-- Insert seed data into project_collaborators table
INSERT INTO public.project_collaborators (project_id, person_id) VALUES
(1, 1),  -- Banana Boy on Summer Town Project
(1, 2),  -- Jesse on Summer Town Project
(2, 1),  -- Banana Boy on Rain Town Project
(2, 2),  -- Jesse on Rain Town Project
(3, 1),  -- Banana Boy on Rocking Out
(3, 3),  -- Alex on Rocking Out
(4, 1);  -- Banana Boy on Solo Instrumental

-- Insert seed data into versions table
INSERT INTO public.versions (version_id, version_name, date_created, project_id) VALUES
(1, 'v2', '2023-01-15', 1),
(2, 'v3', '2023-01-20', 1),
(3, 'with vocals', '2023-02-20', 2),
(4, 'acoustic', '2023-02-25', 2);
