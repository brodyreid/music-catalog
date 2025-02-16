import { ProjectFormData } from '@/pages/Projects.tsx';
import supabase from '@/supabase.ts';
import { Json, Database as Smeg } from '@/types/database.types.ts';
import { Contributor, ProjectWithAll } from '@/types/index.ts';
import Database from '@tauri-apps/plugin-sql';

export type DataTyper =
  | {
      album: Json | null;
      bpm: number | null;
      contributors: Json | null;
      date_created: string | null;
      folder_path_hash: string | null;
      id: number | null;
      musical_key: Smeg['public']['Enums']['musical_key'] | null;
      notes: string | null;
      path: string | null;
      release_name: string | null;
      title: string | null;
    }[]
  | null;

// Example query function
export async function getAllProjects() {
  const db: Database | null = await Database.load('sqlite:music_catalog.db');
  const result = (await db.select('SELECT * FROM projects_with_all')) as DataTyper;
  console.log({ db, result });
  return result;
}

export const PAGE_SIZE = 100;

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
