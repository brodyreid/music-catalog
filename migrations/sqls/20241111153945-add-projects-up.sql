CREATE TABLE projects (
  project_id integer PRIMARY KEY,
  project_number integer,
  title varchar(255),
  folder_path text,
  notes text,
  date_created date
);