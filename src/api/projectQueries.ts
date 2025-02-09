import supabase from '@/supabase.ts';
import { Database } from '@/types/database.types.ts';

export const PAGE_SIZE = 100;

export const fetchProjects = async (page: number) => {
  const from = page * PAGE_SIZE;
  const to = page * PAGE_SIZE + (PAGE_SIZE - 1);

  const { data, error, count } = await supabase.from('projects').select(`*, contributors ( * ), albums ( * )`, { count: 'exact' }).range(from, to);
  if (error) {
    throw error;
  }

  return { projects: data, count, hasMore: count ? count > to : false };
};

export type InsertProjectData = Database['public']['Tables']['projects']['Insert'];
export const createProject = async (data: InsertProjectData) => {
  const { error } = await supabase.from('projects').insert(data);
  if (error) {
    throw error;
  }
};

export type UpdateProjectData = {
  id: number;
  data: Database['public']['Tables']['projects']['Update'];
};
export const updateProject = async ({ id, data }: UpdateProjectData) => {
  const { error } = await supabase.from('projects').update(data).eq('id', id);
  if (error) {
    throw error;
  }
};

export const deleteProject = async (id: number) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    throw error;
  }
};
