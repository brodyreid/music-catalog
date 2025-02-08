import supabase from '@/supabase.ts';
import { Database } from '@/types/database.types.ts';

export const fetchProjects = async () => {
  const { data, error } = await supabase.from('projects').select(`*, contributors ( * ), albums ( * )`);
  if (error) {
    throw error;
  }
  return data;
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
