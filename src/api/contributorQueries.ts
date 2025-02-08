import supabase from '@/supabase.ts';

export const fetchContributors = async () => {
  const { data, error } = await supabase.from('contributors').select(`*`).order('first_name');
  if (error) {
    throw error;
  }
  return data;
};
