import { createProject, deleteProject, fetchProjects, updateProject } from '@/api/projectQueries.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetProjects = () => useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

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

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { deleteProject: mutate, isDeleting: isPending };
};
