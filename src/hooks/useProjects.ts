import { fetchProjects } from '@/api/projectQueries.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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
