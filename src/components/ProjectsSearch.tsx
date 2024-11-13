import { KeyboardEvent, useEffect, useState } from 'react';
import ArrowRight from '../icons/ArrowRight.tsx';
import { Project } from './ProjectsList.tsx';

export default function ProjectsSearch() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/projects');
        const data = await response.json() as Project[];
        setProjects(data);
      } catch (err) {
        console.error(err);
        throw new Error('oopsy daisy did i do that?');
      }
    })();
  }, []);

  useEffect(() => {
    if (!projects.length) { return; }

    setFilteredProjects(projects.filter(project => project.title?.toLowerCase().includes(currentSearchTerm.toLowerCase())
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
        <div className="mt-16">
        <table className="font-mono leading-8">
          <thead>
            <tr className='text-left border-b'>
              <th className='pr-8'>id</th>
              <th className='pr-8'>number</th>
              <th className='pr-8'>title</th>
              <th className='pr-8'>path</th>
              <th>date_created</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(({ project_id, project_number, title, folder_path, date_created }) => (
              <tr key={project_id}>
                <td className='text-nowrap pr-8'>{project_id}</td>
                <td className='text-nowrap pr-8'>{project_number}</td>
                <td className='text-nowrap pr-8'>{title}</td>
                <td className='text-nowrap pr-8'>{folder_path}</td>
                <td className="text-nowrap ">{date_created && new Date(date_created).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </>
  );
}