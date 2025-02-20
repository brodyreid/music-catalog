import db from '@/database.ts';
import { Contributor, MusicalKey } from '@/types/index.ts';

export const PAGE_SIZE = 100;

export interface Project {
  id: number;
  title: string;
  bpm: number | null;
  date_created: string | null;
  folder_path_hash: string;
  musical_key: MusicalKey | null;
  notes: string | null;
  path: string | null;
  release_name: string | null;
}

export interface Album {
  id: number;
  title: string;
  notes: string | null;
  release_date: string | null;
}

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

  console.log({ whereClause, params });
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
          WHERE ap.project_id = ?
          LIMIT 1;
        `,
        [project.id],
      );

      const contributors = await db.select<Contributor[]>(
        `
          SELECT c.*
          FROM project_contributors pc
          JOIN contributors c ON pc.contributor_id = c.id
          WHERE pc.project_id = ?;
        `,
      );

      return {
        ...project,
        album,
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
