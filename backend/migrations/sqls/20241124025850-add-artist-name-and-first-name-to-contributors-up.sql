ALTER TABLE contributors RENAME COLUMN "name" TO first_name;
ALTER TABLE contributors ADD COLUMN artist_name varchar(255);