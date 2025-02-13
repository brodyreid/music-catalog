import { AlbumFormData } from '@/pages/Albums.tsx';
import supabase from '@/supabase.ts';

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

export const createAlbum = async (data: AlbumFormData) => {
  const { projects, ...albumData } = data;

  const { data: newAlbum, error: albumError } = await supabase
    .from('albums')
    .insert(albumData)
    .select()
    .single();
  if (albumError) {
    throw albumError;
  }

  if (projects.length) {
    const projectsData = projects.map((p) => ({
      album_id: newAlbum.id,
      project_id: p.id,
    }));

    const { error: projectsError } = await supabase
      .from('album_projects')
      .insert(projectsData);
    if (projectsError) {
      throw projectsError;
    }
  }
};

export const updateAlbum = async ({ id, data }: { id: number; data: AlbumFormData }) => {
  const { projects, ...albumData } = data;

  const { error: albumError } = await supabase
    .from('albums')
    .update(albumData)
    .eq('id', id);
  if (albumError) {
    throw albumError;
  }

  const { error: deleteError } = await supabase
    .from('album_projects')
    .delete()
    .eq('album_id', id);
  if (deleteError) {
    throw deleteError;
  }

  if (!projects.length) {
    return;
  }

  const projectsData = projects.map((p) => ({ album_id: id, project_id: p.id }));

  const { error: projectsError } = await supabase
    .from('album_projects')
    .insert(projectsData);
  if (projectsError) {
    throw projectsError;
  }
};

export const deleteAlbum = async (id: number) => {
  const { error } = await supabase.from('albums').delete().eq('id', id);
  if (error) {
    throw error;
  }
};
