import { fetchContributors } from '@/api/contributorQueries.ts';
import { useQuery } from '@tanstack/react-query';

export const useGetContributors = () =>
  useQuery({ queryKey: ['contributors'], queryFn: fetchContributors });
