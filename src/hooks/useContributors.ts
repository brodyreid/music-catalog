import { createContributor, fetchContributors, updateContributor } from '@/api/contributorQueries.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetContributors = () => useQuery({ queryKey: ['contributors'], queryFn: fetchContributors });

export const useCreateContributor = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createContributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
    },
  });
  return { createContributor: mutate, isCreating: isPending };
};

export const useUpdateContributor = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateContributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
    },
  });
  return { updateContributor: mutate, isUpdating: isPending };
};
