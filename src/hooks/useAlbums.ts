import { createAlbum, deleteAlbum, fetchAlbums, updateAlbum } from '@/api/albumQueries.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAlbums = () => useQuery({ queryKey: ['albums'], queryFn: fetchAlbums });

export const useCreateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlbum,
    onSuccess: (data) => {
      queryClient.setQueryData(['albums'], data);
    },
  }).mutate;
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  }).mutate;
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlbum,
    onSuccess: (data) => {
      queryClient.setQueryData(['albums'], data);
    },
  }).mutate;
};
