import { useEffect, useState } from 'react';
import { Project } from '../types.ts';
import { formatDate } from '../utils.ts';
import useFetchData from './useFetchData.tsx';

export const usePagination = (url: string, currentSearchTerm?: string) => {
  const { data: projects, loading, error } = useFetchData<Project>(url);
  const [currentData, setCurrentData] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const postsPerPage = 50;

  const handleChangePage = (direction: 'forward' | 'backward') => {
    setCurrentPage(prev => direction === 'forward' ? prev + 1 : prev - 1);
  };

  const searchProjects = (projects: Project[]) => {
    const cleanProjects = projects.map(({ title, versions, ...rest }) => ({
      title: title.replace('Project', '').trim(),
      versions: versions,
      ...rest,
    }));

    if (!currentSearchTerm) { return cleanProjects; }

    const wordsToSearch: string[] = currentSearchTerm ? currentSearchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '') : [];

    return cleanProjects.filter(project =>
      wordsToSearch.every(word =>
        project.title.toLowerCase().includes(word) ||
        project.folder_path.toLowerCase().includes(word) ||
        project.notes?.toLowerCase().includes(word) ||
        project.release_name?.toLowerCase().includes(word) ||
        project.contributors?.map(c => [c.first_name, c.artist_name]).join(' ').toLowerCase().includes(word) ||
        project.versions?.map(v => v.name).join(' ').toLowerCase().includes(word) ||
        project.date_created && formatDate(project.date_created).toLowerCase().includes(word)
      )
    );
  };

  useEffect(() => {
    if (!projects.length) { return; }

    const searchedProjects = searchProjects(projects);

    setNumberOfPages(Math.ceil(searchedProjects.length / postsPerPage));

    const startIndex = postsPerPage * (currentPage - 1);
    const stopIndex = startIndex + postsPerPage;

    setCurrentData(searchedProjects.slice(startIndex, stopIndex));
  }, [projects, currentPage, currentSearchTerm]);

  return { numberOfPages, currentPage, currentData, handleChangePage, loading, error };
};