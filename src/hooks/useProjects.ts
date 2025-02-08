import { fetchProjects } from '@/api/projectQueries.ts';
import { useQuery } from '@tanstack/react-query';

export const useGetProjects = () => useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
