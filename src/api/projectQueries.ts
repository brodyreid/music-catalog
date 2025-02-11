import { FormData } from '@/pages/Projects.tsx';
import supabase from '@/supabase.ts';
import { Database } from '@/types/database.types.ts';

export const PAGE_SIZE = 100;

export const fetchProjects = async (page: number) => {
  const from = page * PAGE_SIZE;
  const to = page * PAGE_SIZE + (PAGE_SIZE - 1);

  const { data, error, count } = await supabase.from('projects').select(`*, contributors ( * ), albums ( * )`, { count: 'exact' }).order('id').range(from, to);
  if (error) {
    throw error;
  }

  return { projects: data, count, hasMore: count ? count > to : false };
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
  const contributorData = contributors.map((c) => ({ project_id: id, contributor_id: c.id }));
  console.log({ id, data, contributorData, projectData });

  const { data: updateData, error: updateError } = await supabase.from('projects').update(projectData).eq('id', id).select();
  console.log('update: ', updateData);
  if (updateError) {
    throw updateError;
  }

  const { data: deleteData, error: deleteError } = await supabase.from('project_contributors').delete().eq('project_id', id).select();
  console.log('delete: ', deleteData);
  if (deleteError) {
    throw deleteError;
  }

  if (!contributorData.length) {
    console.log('failed with length: ', contributorData.length);
    return;
  }

  const { data: insertData, error: insertError } = await supabase.from('project_contributors').insert(contributorData).select();
  console.log('insert: ', insertData);
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
