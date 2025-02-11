import { FormData } from '@/pages/Projects.tsx';
import supabase from '@/supabase.ts';
import { Database } from '@/types/database.types.ts';
import { Contributor, ProjectWithAll } from '@/types/index.ts';

export const PAGE_SIZE = 100;

export const fetchProjects = async ({ page, searchTerm }: { page: number; searchTerm: string }) => {
  const from = page * PAGE_SIZE;
  const to = page * PAGE_SIZE + (PAGE_SIZE - 1);
  console.log('search: ', searchTerm);

  const query = searchTerm ? supabase.from('projects_with_all').select('*').filter('title', 'ilike', `%${searchTerm}%`) : supabase.from('projects_with_all').select('*', { count: 'exact' });

  const { data, error, count } = await query.order('id').range(from, to);
  if (error) {
    throw error;
  }

  return { projects: data as ProjectWithAll[], count, hasMore: count ? count > to : false };
};

type InsertProjectData = Database['public']['Tables']['projects']['Insert'];
export const createProject = async (data: InsertProjectData) => {
  const { error } = await supabase.from('projects').insert(data);
  if (error) {
    throw error;
  }
};

export const updateProject = async ({ id, data }: { id: number; data: FormData }) => {
  const { contributors, ...projectData } = data;

  const { error: updateError } = await supabase.from('projects').update(projectData).eq('id', id);
  if (updateError) {
    throw updateError;
  }

  const { error: deleteError } = await supabase.from('project_contributors').delete().eq('project_id', id);
  if (deleteError) {
    throw deleteError;
  }

  const newContributors = contributors.filter((c) => !c.id);
  let insertedContributors: Contributor[] = [];
  if (newContributors.length) {
    const { data: newData, error: newError } = await supabase.from('contributors').insert(newContributors).select();
    if (newError) {
      throw newError;
    }

    insertedContributors = newData;
  }

  const allContributors = contributors.map((c) => (c.id ? c : insertedContributors.find((ic) => ic.artist_name === c.artist_name))) as Contributor[];

  const { error: insertError } = await supabase.from('project_contributors').insert(allContributors.map((c) => ({ project_id: id, contributor_id: c.id })));
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
