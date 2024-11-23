import { useEffect, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { Project, SortOptions } from '../types.ts';
import { formatDate } from '../utils.ts';
import ProjectsWithContributorsTable from './ProjectsWithContributorsTable.tsx';
import Search from './Search.tsx';
import UpdateNotes from './UpdateNotes.tsx';
import UpdateReleaseName from './UpdateReleaseName.tsx';

export default function ProjectsWithContributors() {
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [sortDirection, setSortDirection] = useState<SortOptions>(null);
  const { data: projects, loading, error: fetchError, refetch } = useFetchData<Project>('http://localhost:3000/projects');

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
          project.release_name?.toLowerCase().includes(word) ||
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

  const updateReleaseName = async (releaseName: string | undefined) => {
    if (!releaseName) {
      console.error('No release name.');
      return;
    }
    if (!selectedProject?.id) {
      console.error('No selected project id.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/project/${selectedProject?.id}/release_name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'release_name': releaseName
        })
      });

      if (!response.ok) {
        console.error(response.status);
        return;
      }

      await response.json();

      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const updateNotes = async (notes: string | undefined) => {
    if (!notes) {
      console.error('No notes.');
      return;
    }
    if (!selectedProject?.id) {
      console.error('No selected project id.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/project/${selectedProject?.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'notes': notes
        })
      });

      if (!response.ok) {
        console.error(response.status);
        return;
      }

      await response.json();

      refetch();
    } catch (error) {
      console.error(error);
    }
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
      <div className='flex items-start justify-between'>
        <Search onSearch={setCurrentSearchTerm} />
        <>
          {selectedProject?.id && (
            <p className='absolute top-4 right-4'>
              <span>currently selected project:</span>
              <span className='ml-2 text-lg text-orange-300'>{selectedProject?.title}</span>
            </p>
          )}
          <div className='flex flex-col gap-2'>
            <UpdateReleaseName onUpdateReleaseName={updateReleaseName} />
            <UpdateNotes onUpdateNotes={updateNotes} />
          </div>
        </>
      </div>
      {filteredProjects.length && (
        <ProjectsWithContributorsTable projects={filteredProjects} selectedProject={selectedProject} onSelectProject={setSelectedProject} sortDirection={sortDirection} onSort={sortByDate} />
      )}
    </>
  );
};