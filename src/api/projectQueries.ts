import supabase from '@/supabase.ts';

export const fetchProjects = async () => {
  const { data, error } = await supabase.from('projects').select(`*, contributors ( * ), albums ( * )`);
  if (error) {
    throw error;
  }
  return data;
};
