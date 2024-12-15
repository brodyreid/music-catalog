import Search from '@/components/shared/Search.tsx';
import { usePagination } from '@/hooks/usePagination.tsx';
import useToast from '@/hooks/useToast.tsx';
import { projectReducer } from '@/reducers/projectReducer.ts';
import { MusicalKey, Project, SortOptions } from '@/types.ts';
import { saveData } from '@/utils.ts';
import { useEffect, useReducer, useState } from 'react';
import ProjectActions from './ProjectActions.tsx';
import ProjectsTable from './ProjectsTable.tsx';

interface UpdateProjectBody {
  release_name: string | null;
  notes: string | null;
  bpm: number | null;
  musical_key: MusicalKey | null;
  contributor_ids: string[];
}

export default function ProjectList() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [sortDirection, setSortDirection] = useState<SortOptions>('desc');
  const { showToast, ToastComponent } = useToast();
  const [projectState, projectDispatch] = useReducer(projectReducer, { selectedProject: null, release_name: null, notes: null, bpm: null, musical_key: null, contributors: [] });
  const { currentData: projects, loading, error: fetchError, refetch, PaginationNumbers, setCurrentPage } = usePagination('http://localhost:3000/projects', currentSearchTerm);

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

  const resetProjectsList = () => {
    setCurrentSearchTerm('');
    refetch();
  };

  const handleSearch = (term: string) => {
    setCurrentSearchTerm(term);
    setCurrentPage(1);
  };

  const handleUpdateProject = async () => {
    if (!projectState.selectedProject) {
      console.error('No project to update.');
      return;
    }

    try {
      const response = await saveData<UpdateProjectBody, { message: string; project: Project; }>(`http://localhost:3000/project/${projectState.selectedProject.id}`, {
        release_name: projectState.release_name,
        notes: projectState.notes,
        bpm: projectState.bpm,
        musical_key: projectState.musical_key,
        contributor_ids: projectState.contributors?.map(c => c.id) ?? []
      });

      setFilteredProjects(prev => prev.map(prevProject => prevProject.id === response.project.id ? response.project : prevProject));
      showToast(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

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
      <ToastComponent />
      <div className='flex items-start justify-between'>
        <Search onSearch={handleSearch} handleReset={resetProjectsList} currentSearchTerm={currentSearchTerm} />
        <ProjectActions projectState={projectState} projectDispatch={projectDispatch} onUpdate={handleUpdateProject} />
      </div>
      {filteredProjects?.length && (
        <>
          <PaginationNumbers />
          <ProjectsTable projects={filteredProjects} projectState={projectState} projectDispatch={projectDispatch} sortDirection={sortDirection} onSort={sortByDate} />
        </>
      )}
    </>
  );
};