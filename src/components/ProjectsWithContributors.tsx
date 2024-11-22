import { useEffect, useRef, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { ProjectFull, SortOptions } from '../types.ts';
import { formatDate } from '../utils.ts';
import ProjectsWithContributorsTable from './ProjectsWithContributorsTable.tsx';

export default function ProjectsWithContributors() {
  const [currentlySelectedProject, setCurrentlySelectedProject] = useState<{ id: string; title: string; }>();
  const releaseNameRef = useRef<HTMLInputElement | null>(null);
  const { data: projects, loading, error: fetchError } = useFetchData<ProjectFull>('http://localhost:3000/projects');

  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<ProjectFull[]>([]);
  const [sortDirection, setSortDirection] = useState<SortOptions>(null);

  useEffect(() => {
    if (!projects.length) { return; }

    const cleanProjects = projects.map(({ title, versions, ...rest }) => ({
      title: title.replace('Project', '').trim(),
      versions: versions.filter(v => v.name.replace('.als', '') !== title.replace(' Project', '')),
      ...rest,
    }));

    setFilteredProjects(cleanProjects
      .filter(project => {
        const wordsToSearch: string[] = currentSearchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');
        return wordsToSearch.every(word =>
          project.title.toLowerCase().includes(word) ||
          project.folder_path?.toLowerCase().includes(word) ||
          project.notes?.toLowerCase().includes(word) ||
          project.contributors.map(c => c.name).join(' ').toLowerCase().includes(word) ||
          project.versions.map(v => v.name).join(' ').toLowerCase().includes(word) ||
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

  const updateReleaseName = (releaseName: string | undefined) => {
    console.log(releaseName);
  };

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
      <div className='flex gap-16'>
        <div>
          <div className='mb-2 text-lg'>search</div>
          <input type="text" onChange={(event) => setCurrentSearchTerm(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
        </div>
        <div>
          <div className='mb-2 text-lg'>update release_name of project {currentlySelectedProject?.title}</div>
          <input type="text" ref={releaseNameRef} className='rounded p-2 bg-primary text-secondary' />
          <button type='button' onClick={() => updateReleaseName(releaseNameRef.current?.value)} className='ml-4 bg-accent px-4 py-2 rounded hover:brightness-90 duration-100'>
            update
          </button>
        </div>
      </div>
      {filteredProjects.length && (
        <ProjectsWithContributorsTable projects={filteredProjects} onSelectProject={setCurrentlySelectedProject} sortDirection={sortDirection} onSort={sortByDate} />
      )}
    </>
  );
};