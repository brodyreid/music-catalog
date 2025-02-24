import db from '@/database.ts';
import { ProjectFormData } from '@/pages/Projects.tsx';
import { Contributor, Project, ProjectWithAll } from '@/types.ts';

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

  const projects = await db.select<any[]>(
    `
    SELECT
      p.*,
      COUNT(*) OVER() AS count,
      CASE
        WHEN a.id IS NULL THEN NULL
        ELSE json_object(
          'id', a.id, 'title', a.title, 'notes', a.notes, 'release_date', a.release_date
        )
      END AS album,
      CASE
        WHEN COUNT(c.id) = 0 THEN json('[]')
        ELSE 
        json_group_array(
          json_object(
            'id', c.id, 'artist_name', c.artist_name, 'first_name', c.first_name
          )
        )
      END AS contributors
    FROM projects p
    LEFT JOIN album_projects ap ON ap.project_id = p.id
    LEFT JOIN albums a ON a.id = ap.album_id
    LEFT JOIN project_contributors pc ON pc.project_id = p.id
    LEFT JOIN contributors c ON c.id = pc.contributor_id
    JOIN projects_search ps on ps.rowid = p.id
    ${whereClause}
    GROUP BY p.id
    LIMIT $1 OFFSET $2;
    `,
    params,
  );

  const projectsParsed: Array<ProjectWithAll & { count: number }> = projects.map((p) => ({
    ...p,
    album: p.album ? JSON.parse(p.album) : null,
    contributors: JSON.parse(p.contributors),
  }));

  const count = projects[0]?.count ?? 0;
  const hasMore = count > page * PAGE_SIZE + (PAGE_SIZE - 1);

  console.log(projects.slice(0, 10));
  console.log(projectsParsed.slice(0, 10));

  return {
    projects: projectsParsed,
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
    await db.execute('BEGIN TRANSACTION;');

    const { contributors, ...projectsData } = data;
    console.log(data);

    const projectResult = await db
      .execute(
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
      )
      .catch((e) => console.error(e))
      .finally(() => console.log('done'));
    console.log(projectResult);

    const deleteResult = await db.execute(
      `DELETE FROM project_contributors WHERE project_id = $1;`,
      [id],
    );

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
      const joinResult = await db.execute(
        `
        INSERT INTO project_contributors (project_id, contributor_id)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [id, contributor.id],
      );
      console.log(joinResult);
    });

    console.log({ projectResult, deleteResult, allContributors });
    await db.execute('COMMIT;');
    return { projectResult, deleteResult, allContributors };
  } catch (error) {
    await db.execute('ROLLBACK;');
    console.error('Error updating project:', error);
    throw new Error('Failed to update project. Please try again later.');
  }
};
