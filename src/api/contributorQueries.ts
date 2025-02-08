import supabase from '@/supabase.ts';
import { Database } from '@/types/database.types.ts';

export const fetchContributors = async () => {
  const { data, error } = await supabase.from('contributors').select(`*`).order('first_name');
  if (error) {
    throw error;
  }
  return data;
};

export type InsertContributorData = Database['public']['Tables']['contributors']['Insert'];
export const createContributor = async (data: InsertContributorData) => {
  const { error } = await supabase.from('contributors').insert(data);
  if (error) {
    throw error;
  }
};

export type UpdateContributorData = {
  id: number;
  data: Database['public']['Tables']['contributors']['Update'];
};
export const updateContributor = async ({ id, data }: UpdateContributorData) => {
  const { error } = await supabase.from('contributors').update(data).eq('id', id);
  if (error) {
    throw error;
  }
};

export const deleteContributor = async (id: number) => {
  const { error } = await supabase.from('contributors').delete().eq('id', id);
  if (error) {
    throw error;
  }
};
