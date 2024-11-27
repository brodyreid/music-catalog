import Cross from '@icons/Cross.tsx';
import { useEffect, useReducer, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { projectReducer } from '../reducers/projectReducer.ts';
import { Project, SortOptions } from '../types.ts';
import { formatDate, saveData } from '../utils.ts';
import ProjectActions from './ProjectActions.tsx';
import ProjectsTable from './ProjectsTable.tsx';
import Search from './Search.tsx';

interface UpdateProjectBody {
  release_name: string | null;
  notes: string | null;
  contributor_ids: string[];
}

export default function Projects() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>();
  const [sortDirection, setSortDirection] = useState<SortOptions>('desc');
  const [projectState, projectDispatch] = useReducer(projectReducer, { selectedProject: null, release_name: null, notes: null, contributors: [] });
  const { data: projects, loading, error: fetchError } = useFetchData<Project>('http://localhost:3000/projects');

  useEffect(() => {
    if (!projects.length) { return; }

    const cleanProjects = projects.map(({ title, versions, ...rest }) => ({
      title: title.replace('Project', '').trim(),
      versions: versions,
      ...rest,
    }));

    setFilteredProjects(cleanProjects
      .filter(project => {
        const wordsToSearch: string[] = currentSearchTerm ? currentSearchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '') : [];
        return wordsToSearch.every(word =>
          project.title.toLowerCase().includes(word) ||
          project.folder_path.toLowerCase().includes(word) ||
          project.notes?.toLowerCase().includes(word) ||
          project.release_name?.toLowerCase().includes(word) ||
          project.contributors?.map(c => [c.first_name, c.artist_name]).join(' ').toLowerCase().includes(word) ||
          project.versions?.map(v => v.name).join(' ').toLowerCase().includes(word) ||
          project.date_created && formatDate(project.date_created).toLowerCase().includes(word)
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

  const handleUpdateProject = async () => {
    if (!projectState.selectedProject) {
      console.error('No project to update.');
      return;
    }

    try {
      const response = await saveData<UpdateProjectBody, { message: string; updatedProject: Project; }>(`http://localhost:3000/project/${projectState.selectedProject.id}`, {
        release_name: projectState.release_name,
        notes: projectState.notes,
        contributor_ids: projectState.contributors?.map(c => c.id) ?? []
      });

      setToastMessage(response.message);
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
      {toastMessage && (
        <div className='absolute z-10 bottom-5 right-5 p-4 bg-green-700 w-64 h-24 rounded-md shadow-lg'>
          <button onClick={() => setToastMessage(null)}><Cross className='absolute top-2 right-2 w-4' /></button>
          {toastMessage}
        </div>
      )}
      <div className='flex items-start justify-between'>
        <Search onSearch={setCurrentSearchTerm} />
        <div className='flex flex-col gap-2'>
          <div className='flex items-center h-12'>
            {projectState.selectedProject && (
              <p className='text-lg text-orange-300'>{projectState.selectedProject.title}</p>
            )}
          </div>
          <ProjectActions projectState={projectState} projectDispatch={projectDispatch} onUpdate={handleUpdateProject} />
        </div>
      </div>
      {filteredProjects?.length && (
        <ProjectsTable projects={filteredProjects} projectState={projectState} projectDispatch={projectDispatch} sortDirection={sortDirection} onSort={sortByDate} />
      )}
    </>
  );
};