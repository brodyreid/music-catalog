import { getDatabase } from '@/database.ts';
import { ProjectFormData } from '@/pages/Projects.tsx';
import { Contributor, Project, ProjectWithAll } from '@/types.ts';
import { apiError } from '@/utils.ts';

export const PAGE_SIZE = 100;

const upsertProjectContributors = async ({
  project_id,
  contributors,
}: {
  project_id: number;
  contributors: Contributor[];
}) => {
  try {
    const db = await getDatabase();

    await db.execute(`DELETE FROM project_contributors WHERE project_id = $1;`, [
      project_id,
    ]);

    const newContributors = contributors.filter((c) => !c.id);
    const exisitingContributors = contributors.filter((c) => c.id);
    const allContributors: Contributor[] = [...exisitingContributors];

    for (const contributor of newContributors) {
      const result = await db.execute(
        `
      INSERT INTO contributors (artist_name, first_name)
      VALUES ($1, $2)
      RETURNING id;
      `,
        [contributor.artist_name, contributor.first_name],
      );

      if (result.lastInsertId) {
        allContributors.push({ ...contributor, id: result.lastInsertId });
      } else {
        apiError(`Failed to insert contributor: ${contributor.artist_name}`);
      }
    }

    for (const contributor of allContributors) {
      await db.execute(
        `
        INSERT INTO project_contributors (project_id, contributor_id)
        VALUES ($1, $2);
      `,
        [project_id, contributor.id],
      );
    }
  } catch (error) {
    apiError(error);
  }
};

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

  try {
    const db = await getDatabase();

    const projectsRaw = await db.select<
      Array<Project & { album: string; contributors: string; count: number }>
    >(
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

    const projects: Array<ProjectWithAll & { count: number }> = projectsRaw.map((p) => ({
      ...p,
      album: p.album ? JSON.parse(p.album) : null,
      contributors: JSON.parse(p.contributors),
    }));

    const count = projects[0]?.count ?? 0;
    const hasMore = count > page * PAGE_SIZE + (PAGE_SIZE - 1);

    return {
      projects,
      count,
      hasMore,
    };
  } catch (error) {
    apiError(error);
  }
};

export const createProject = async (data: Omit<ProjectWithAll, 'id' | 'albums'>) => {
  try {
    const db = await getDatabase();

    const { contributors, ...projectsData } = data;

    const result = await db.execute(
      `
        INSERT INTO projects (title, bpm, date_created, folder_path_hash, musical_key, notes, path, release_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `,
      [
        projectsData.title,
        projectsData.bpm,
        projectsData.date_created,
        projectsData.folder_path_hash,
        projectsData.musical_key,
        projectsData.notes,
        projectsData.path,
        projectsData.release_name,
      ],
    );

    if (result.lastInsertId) {
      await upsertProjectContributors({ project_id: result.lastInsertId, contributors });
    }

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};

export const updateProject = async ({
  id,
  data,
}: {
  id: number;
  data: ProjectFormData;
}) => {
  try {
    const db = await getDatabase();

    const { contributors, ...projectsData } = data;

    await db.execute(
      `
      UPDATE projects
      SET title = $2, bpm = $3, date_created = $4, musical_key = $5, notes = $6, path = $7, release_name = $8
      WHERE id = $1;
      `,
      [
        id,
        projectsData.title,
        projectsData.bpm,
        projectsData.date_created,
        projectsData.musical_key,
        projectsData.notes,
        projectsData.path,
        projectsData.release_name,
      ],
    );

    await upsertProjectContributors({ project_id: id, contributors });

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};

export const deleteProject = async (id: number) => {
  try {
    const db = await getDatabase();

    await db.execute(`DELETE FROM projects WHERE id = $1;`, [id]);

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};
