import {
  createAlbum,
  deleteAlbum,
  fetchAlbums,
  updateAlbum,
} from '@/api/albumQueries.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAlbums = () =>
  useQuery({ queryKey: ['albums'], queryFn: fetchAlbums });

export const useCreateAlbum = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  return { createAlbum: mutate, isCreating: isPending };
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  return { updateAlbum: mutate, isUpdating: isPending };
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  return { deleteAlbum: mutate, isDeleting: isPending };
};
