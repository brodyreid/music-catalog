CREATE TABLE projects (
  id char(16) PRIMARY KEY,
  title varchar(255),
  folder_path text,
  notes text,
  date_created date
);