import { AlbumFormData } from '@/pages/Albums.tsx';
import supabase from '@/supabase.ts';
import { Database } from '@/types/database.types.ts';

export const fetchAlbums = async () => {
  const { data, error } = await supabase
    .from('albums')
    .select(`*, projects ( * )`)
    .order('id');
  if (error) {
    throw error;
  }
  return data;
};

export type InsertAlbumData = Database['public']['Tables']['albums']['Insert'];
export const createAlbum = async (data: InsertAlbumData) => {
  const { error } = await supabase.from('albums').insert(data);
  if (error) {
    throw error;
  }
};

export const updateAlbum = async ({ id, data }: { id: number; data: AlbumFormData }) => {
  const { projects, ...albumData } = data;

  const { error: projectsError } = await supabase
    .from('projects')
    .update({ album_id: id })
    .in(
      'id',
      projects.map((p) => p.id),
    );

  if (projectsError) {
    throw projectsError;
  }

  const { error: albumError } = await supabase
    .from('albums')
    .update(albumData)
    .eq('id', id);
  if (albumError) {
    throw albumError;
  }
};

export const deleteAlbum = async (id: number) => {
  const { error } = await supabase.from('albums').delete().eq('id', id);
  if (error) {
    throw error;
  }
};
