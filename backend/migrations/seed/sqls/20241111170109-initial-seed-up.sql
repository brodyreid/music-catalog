-- Insert seed data into contributors table
INSERT INTO public.contributors (id, first_name, artist_name) VALUES ("1", 'Finn', 'Baby Finn'), ("2", '', 'Jake the Dog'), ("3", 'Princess Bubblegum', 'Bubble P'), ("4", 'Lumpy Space Princess', 'DJ LSP'), ("5", 'Marceline', ''), ("6", 'BMO', ''), ("7", 'Gunter', 'DJ Pengüino'), ("8", '', 'Ice King'), ("9", 'Starchy', '');

-- Insert seed data into projects table
-- dates are yyyy-mm-dd
INSERT INTO public.projects (id, title, folder_path, notes, date_created, release_name) VALUES
("1", 'buff baby Project', '/Users/username/Documents/Music/Ableton/Projects/My Productions/buff baby Project', '', '2024-08-03', 'Puncha yo Buns'),
("2", 'cool beat Project', '/Users/username/Documents/Music/Ableton/Projects/My Productions/cool beat Project', 'love this one!', '2024-07-24', 'Bacon Pancakes'),
("3", 'sad song idea Project', '/Users/username/Documents/Music/Ableton/Projects/My Productions/sad song idea Project', '', '2023-07-24', 'Not Just Your Little Girl'),
("4", 'hiphop type Project', '/Users/username/Documents/Music/Ableton/Projects/Collabs/hiphop type Project', 'reminds me of christmas! should rerelease this next year', '2023-11-06', 'The Decorating Song'),
("5", 'august jam session Project', '/Users/username/Documents/Music/Ableton/Projects/Collabs/august jam session Project', '', '2024-08-07', 'My Best Friends in the World (What Am I To You?)'),
("6", 'upbeat dancey Project', '/Users/username/Documents/Music/Ableton/Projects/My Productions/upbeat dancey Project', '', '2023-05-01', ''),
("7", 'sunday song Project', '/Users/username/Documents/Music/Ableton/Projects/My Productions/sunday song Project', 'couldnt figure out what to do for instruments here... maybe ask someone for guitar on top?', '2024-06-23', '');

-- Insert seed data into project_contributors table
INSERT INTO public.project_contributors (project_id, contributor_id) VALUES ("1", "1"), ("2", "2"), ("3", "5"), ("4", "1"), ("4", "2"), ("5", "1"), ("5", "2"), ("5", "3"), ("5", "5"), ("5", "6")

-- Insert seed data into versions table
INSERT INTO public.versions (id, project_id, "name", date_created) VALUES
("1", "2", 'cool beat Project v2.als', ''),
("3", "3", 'sad song idea Project v2.als', ''),
("4", "3", 'sad song idea Project v3.als', ''),
("6", "6", 'upbeat dancey Project v2.als', ''),
("7", "6", 'upbeat dancey Project v2 STEMS.als', ''),
("8", "6", 'upbeat dancey Project v3.als', ''),
("9", "6", 'upbeat dancey Project v4.als', '');