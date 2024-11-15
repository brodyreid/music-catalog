import { useEffect, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { ProjectFull, SortOptions } from '../types.ts';
import { formatDate } from '../utils.ts';
import ProjectsWithContributorsTable from './ProjectsWithContributorsTable.tsx';

export default function ProjectsWithContributors() {
  const { data: projects, loading, error: fetchError } = useFetchData<ProjectFull>('http://localhost:3000/projects/versions/contributors');

  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<ProjectFull[]>([]);
  const [sortDirection, setSortDirection] = useState<SortOptions>(null);

  useEffect(() => {
    if (!projects.length) { return; }

    setFilteredProjects(projects
      .filter(project => {
        const wordsToSearch: string[] = currentSearchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');
        return wordsToSearch.every(word =>
          project.title?.toLowerCase().includes(word) ||
          project.folder_path?.toLowerCase().includes(word) ||
          project.notes?.toLowerCase().includes(word) ||
          project.contributors?.join(' ').toLowerCase().includes(word) ||
          formatDate(project.date_created)?.toLowerCase().includes(word)
        );
      }
      ));
  }, [currentSearchTerm, projects]);

  const sortByDate = (direction: SortOptions) => {
    const newData = projects.sort((a, b) => {
      if (!a.date_created || !b.date_created) { return 0; }

      if (direction === 'asc') {
        return (a.date_created < b.date_created) ? -1 : ((a.date_created > b.date_created) ? 1 : 0);
      }
      if (direction === 'desc') {
        return (a.date_created < b.date_created) ? 1 : ((a.date_created > b.date_created) ? -1 : 0);
      }

      return (a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
    });

    setSortDirection(direction);
    setFilteredProjects(newData);

  };
  console.log(sortDirection);
  if (!projects.length) {
    return (
      <div>Sorry gamer, we couldn't find any projects :/</div>
    );
  }

  if (fetchError) {
    console.error(fetchError);
    return (
      <>
        <div>Sorry gamer, there was an error!</div>
        <pre className='mt-8'>{fetchError.name}: {fetchError.message}</pre>
      </>
    );
  }

  if (loading) {
    return (
      <div>Please wait, gamer! It's loading...</div>
    );
  }

  return (
    <>
      <div className='flex items-center gap-8'>
        <input type="text" onChange={(event) => setCurrentSearchTerm(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
      </div>
      {filteredProjects.length && (
        <ProjectsWithContributorsTable projects={filteredProjects} sortDirection={sortDirection} onSort={sortByDate} />
      )}
    </>
  );
};