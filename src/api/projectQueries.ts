import db from '@/database.ts';
import { ProjectFormData } from '@/pages/Projects.tsx';
import supabase from '@/supabase.ts';
import { Database as Smeg } from '@/types/database.types.ts';
import { Contributor, MusicalKey, ProjectWithAll } from '@/types/index.ts';

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

export const testFetchProjects = async ({
  page,
  searchTerm,
}: {
  page: number;
  searchTerm: string;
}) => {
  let whereClause = '';
  if (searchTerm) {
    const conditions = searchTerm.trim().split(' ').join(' AND ').concat('*');
    whereClause = `WHERE projects_search = '${conditions}'`;
  }
  const projects = await db.select<Project[]>(
    `
      SELECT * FROM projects_search ${whereClause} LIMIT $1 OFFSET $2;
    `,
    [PAGE_SIZE, page * PAGE_SIZE],
  );

  const projectsWithAlbum = await Promise.all(
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

      return {
        ...project,
        album,
      };
    }),
  );

  const countResult = await db.select<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM projects;',
  );
  const count = countResult[0]?.count ?? 0;
  const hasMore = count > page * PAGE_SIZE + (PAGE_SIZE - 1);

  return {
    projects: projectsWithAlbum as Array<Project & { album?: Album }>,
    count,
    hasMore,
  };
};

export const fetchProjects = async ({
  page,
  searchTerm,
}: {
  page: number;
  searchTerm: string;
}) => {
  const words = searchTerm?.split(' ');
  const columns = ['title', 'release_name', 'path'];

  let query = supabase.from('projects_with_all').select('*', { count: 'exact' });

  if (words.length) {
    words.map((word) => {
      query = query.or(columns.map((col) => `${col}.ilike.%${word}%`).join(','));
    });
  }
  const { data, error, count } = await query
    .order('id')
    .range(page * PAGE_SIZE, page * PAGE_SIZE + (PAGE_SIZE - 1));
  if (error) {
    throw error;
  }

  return {
    projects: data as ProjectWithAll[],
    count,
    hasMore: count ? count > page * PAGE_SIZE + (PAGE_SIZE - 1) : false,
  };
};

type InsertProjectData = Smeg['public']['Tables']['projects']['Insert'];
export const createProject = async (data: InsertProjectData) => {
  const { error } = await supabase.from('projects').insert(data);
  if (error) {
    throw error;
  }
};

export const updateProject = async ({
  id,
  data,
}: {
  id: number;
  data: ProjectFormData;
}) => {
  const { contributors, ...projectData } = data;

  const { error: updateError } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id);
  if (updateError) {
    throw updateError;
  }

  const { error: deleteError } = await supabase
    .from('project_contributors')
    .delete()
    .eq('project_id', id);
  if (deleteError) {
    throw deleteError;
  }

  const newContributors = contributors.filter((c) => !c.id);
  let insertedContributors: Contributor[] = [];
  if (newContributors.length) {
    const { data: newData, error: newError } = await supabase
      .from('contributors')
      .insert(newContributors)
      .select();
    if (newError) {
      throw newError;
    }

    insertedContributors = newData;
  }

  const allContributors = contributors.map((c) =>
    c.id ? c : insertedContributors.find((ic) => ic.artist_name === c.artist_name),
  ) as Contributor[];

  if (!allContributors.length) {
    return;
  }

  const { error: insertError } = await supabase
    .from('project_contributors')
    .insert(allContributors.map((c) => ({ project_id: id, contributor_id: c.id })));
  if (insertError) {
    throw insertError;
  }
};

export const deleteProject = async (id: number) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    throw error;
  }
};
