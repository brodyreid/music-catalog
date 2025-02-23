import { createProject, fetchProjects, updateProject } from '@/api/projectQueries.ts';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const useGetProjects = ({
  page,
  searchTerm,
}: {
  page: number;
  searchTerm: string;
}) =>
  useQuery({
    queryKey: ['projects', page, searchTerm],
    queryFn: () => fetchProjects({ page, searchTerm }),
    placeholderData: keepPreviousData,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { createProject: mutate, isCreating: isPending };
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { updateProject: mutate, isUpdating: isPending };
};
