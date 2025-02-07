import supabase from '@/supabase.ts';
import { Database } from '@/types/database.types.ts';

export const fetchAlbums = async () => {
  const { data, error } = await supabase.from('albums').select(`*, projects ( * )`).order('id');
  if (error) {
    throw error;
  }
  return data;
};

export type UpdateAlbumData = {
  id: number;
  data: Database['public']['Tables']['albums']['Update'];
};
export const updateAlbum = async ({ id, data }: UpdateAlbumData) => {
  const { error } = await supabase.from('albums').update(data).eq('id', id);
  if (error) {
    throw error;
  }
};

export type InsertAlbumData = Database['public']['Tables']['albums']['Insert'];
export const createAlbum = async (data: InsertAlbumData) => {
  const { error } = await supabase.from('albums').insert({ title: data.title, notes: data.notes || null, release_date: data.release_date || null });
  if (error) {
    throw error;
  }
};

export const deleteAlbum = async (id: number) => {
  const { error } = await supabase.from('albums').delete().eq('id', id);
  if (error) {
    throw error;
  }
};
