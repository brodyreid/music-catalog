CREATE TABLE "projects" (
  "project_id" integer PRIMARY KEY,
  "project_number" integer,
  "title" varchar(255),
  "folder_path" text,
  "notes" text,
  "date_created" date
);

CREATE TABLE "versions" (
  "version_id" integer PRIMARY KEY,
  "version_name" varchar(255),
  "date_created" date
);

CREATE TABLE "people" (
  "person_id" integer PRIMARY KEY,
  "name" varchar(255)
);

CREATE TABLE "project_collaborators" (
  "project_id" integer,
  "person_id" integer
);

ALTER TABLE "project_collaborators" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id");

ALTER TABLE "project_collaborators" ADD FOREIGN KEY ("person_id") REFERENCES "people" ("person_id");
