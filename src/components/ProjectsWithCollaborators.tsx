import { KeyboardEvent, useEffect, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import ArrowRight from '../icons/ArrowRight.tsx';
import { ProjectCollab } from '../types.ts';
import ProjectsWithCollaboratorsTable from './ProjectsWithCollaboratorsTable.tsx';

export default function ProjectsWithCollaborators() {
  const { data: projects, loading, error } = useFetchData<ProjectCollab>('http://localhost:3000/projects/collaborators');

  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<ProjectCollab[]>([]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) { return; }

    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    if (!projects.length) { return; }

    setFilteredProjects(projects
      .map(project => ({ ...project, date_created: formatDate(project.date_created) }))
      .filter(project => {
        const wordsToSearch: string[] = currentSearchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');
        return wordsToSearch.every(word =>
          project.project_number?.toString().includes(word) ||
          project.title?.toLowerCase().includes(word) ||
          project.folder_path?.toLowerCase().includes(word) ||
          project.date_created?.toLowerCase().includes(word)
        );
      }
      ));
  }, [currentSearchTerm, projects]);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setSubmittedSearchTerm(currentSearchTerm);
    setCurrentSearchTerm('');
  };

  if (!projects.length) {
    return (
      <div>Sorry gamer, we couldn't find any projects :/</div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <>
        <div>Sorry gamer, there was an error!</div>
        <pre className='mt-8'>{error.name}: {error.message}</pre>
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
        <input type="text" onChange={(event) => setCurrentSearchTerm(event.target.value)}
          onKeyDown={handleKeyPress} className='rounded p-2 bg-stone-300 text-zinc-900' />
        <button type='button' onClick={handleSubmit} className='py-2 px-4 rounded bg-indigo-700 hover:brightness-90 duration-100'><ArrowRight className='text-stone-300 w-4' /></button>
      </div>
      {submittedSearchTerm && (
        <div className='mt-4 py-0.5 px-4 w-min bg-zinc-500 rounded-full border border-gray-700'>
          <p className='text-zinc-800 text-sm'>{submittedSearchTerm}</p>
        </div>
      )}
      {filteredProjects.length && (
        <ProjectsWithCollaboratorsTable projects={filteredProjects} />
      )}
    </>
  );
};