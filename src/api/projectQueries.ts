import db from '@/database.ts';
import { ProjectFormData } from '@/pages/Projects.tsx';
import { Album, Contributor, Project } from '@/types.ts';

export const PAGE_SIZE = 100;

export const fetchProjects = async ({
  page,
  searchTerm,
}: {
  page: number;
  searchTerm: string;
}) => {
  let params: Array<number | string> = [PAGE_SIZE, page * PAGE_SIZE];
  let whereClause = '';
  if (searchTerm) {
    const terms = searchTerm
      .trim()
      .split(' ')
      .map((term) => term.replace(/[^a-zA-Z0-9]/g, '') + '*');
    whereClause = `WHERE projects_search MATCH $3`;
    params.push(terms.join(' AND '));
  }

  const projects = await db.select<Array<Project & { count: number }>>(
    `
      SELECT p.*, COUNT(*) OVER() as count
      FROM projects p
      JOIN projects_search ps on ps.rowid = p.id
      ${whereClause}
      LIMIT $1 OFFSET $2;
    `,
    params,
  );

  const projectsWithAll = await Promise.all(
    projects.map(async (project) => {
      const [album] = await db.select<Album[]>(
        `
          SELECT a.* 
          FROM album_projects ap
          JOIN albums a ON a.id = ap.album_id
          WHERE ap.project_id = $1
          LIMIT 1;
        `,
        [project.id],
      );

      const contributors = await db.select<Contributor[]>(
        `
          SELECT c.*
          FROM project_contributors pc
          JOIN contributors c ON pc.contributor_id = c.id
          WHERE pc.project_id = $1;
        `,
        [project.id],
      );

      return {
        ...project,
        ...(album ? { album } : {}),
        contributors,
      };
    }),
  );

  const count = projects[0]?.count ?? 0;
  const hasMore = count > page * PAGE_SIZE + (PAGE_SIZE - 1);

  return {
    projects: projectsWithAll,
    count,
    hasMore,
  };
};

export const createProject = async (data: Project) => {
  const result = await db.execute(
    `
    INSERT INTO projects (title, bpm, date_created, folder_path_hash, musical_key, notes, path, release_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
  `,
    [
      data.title,
      data.bpm,
      data.date_created,
      data.folder_path_hash,
      data.musical_key,
      data.notes,
      data.path,
      data.release_name,
    ],
  );

  return result.lastInsertId;
};

export const updateProject = async ({
  id,
  data,
}: {
  id: number;
  data: ProjectFormData;
}) => {
  try {
    const { contributors, ...projectsData } = data;

    await db.execute('BEGIN TRANSACTION;');
    await db.execute(
      `
      UPDATE projects
      SET title = $1, bpm = $2, date_created = $3, musical_key = $4, notes = $5, path = $6, release_name = $7
      WHERE id = $8;
      `,
      [
        projectsData.title,
        projectsData.bpm,
        projectsData.date_created,
        projectsData.musical_key,
        projectsData.notes,
        projectsData.path,
        projectsData.release_name,
        id,
      ],
    );
    await db.execute(`DELETE FROM project_contributors WHERE project_id = $1;`, [id]);

    const newContributors = contributors.filter((c) => !c.id);
    const allContributors: Contributor[] = contributors;

    newContributors.forEach(async (contributor) => {
      const result = await db.execute(
        `
        INSERT INTO contributors (artist_name, first_name)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [contributor.artist_name, contributor.first_name],
      );

      if (result.lastInsertId) {
        allContributors.push({ ...contributor, id: result.lastInsertId });
      } else {
        throw new Error(`Failed to insert contributor: ${contributor.artist_name}`);
      }
    });

    allContributors.forEach(async (contributor) => {
      await db.execute(
        `
        INSERT INTO project_contributors (project_id, contributor_id)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [id, contributor.id],
      );
    });

    await db.execute('COMMIT;');
  } catch (error) {
    await db.execute('ROLLBACK;');
    console.error('Error updating project:', error);
    throw new Error('Failed to update project. Please try again later.');
  }
};
