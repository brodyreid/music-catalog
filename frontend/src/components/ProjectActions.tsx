import Cross from '@icons/Cross.tsx';
import Plus from '@icons/Plus.tsx';
import { Dispatch, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { ProjectActions, ProjectState } from '../reducers/projectReducer.ts';
import { Contributor } from '../types.ts';
import Modal from './Modal.tsx';

interface ProjectActionsProps {
  projectState: ProjectState;
  projectDispatch: Dispatch<ProjectActions>;
  onUpdate: (projectState: ProjectState) => void;
}

export default function ProjectActions({ projectState, projectDispatch, onUpdate }: ProjectActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: contributors } = useFetchData<Contributor>('http://localhost:3000/contributors');

  function handleRemoveContributor(contributorId: string) {
    projectDispatch({ type: 'removed_contributor', contributorId });
  }

  function handleAddContributor(contributor: Contributor) {
    projectDispatch({ type: 'added_contributor', contributor });
    setIsModalOpen(false);
  }

  return (
    <>
      <div className='grid grid-cols-2 gap-8'>
        <div>
          <p className='text-lg'>contributors</p>
          <div className='flex flex-col gap-4'>
            <ul className='rounded p-2 bg-primary text-secondary space-y-2'>
              {projectState.contributors?.map(c => (
                <li key={c.id} className='flex items-center justify-between'>
                  <div><span className='font-bold text-accent'>{c.artist_name}</span> - {c.first_name}</div>
                  <button onClick={() => handleRemoveContributor(c.id)}><Cross className='w-4' /></button>
                </li>
              ))}
              <li className='text-sm'>
                <button type='button' className='bg-transparent text-stone-500 hover:brightness-75 duration-100 ring-0 border-none outline-none' onClick={() => setIsModalOpen(true)}>
                  <div className='flex items-center'><Plus className='w-4 mr-1' />add contributor</div>
                </button>
              </li>
            </ul>
            <button
              type='button'
              disabled={!projectState.selectedProject}
              onClick={() => onUpdate(projectState)}
              className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 duration-100'
            >
              update
            </button>
          </div>
        </div>
        <div>
          <p className='text-lg'>release_name</p>
          <div className='flex items-center gap-4'>
            <input
              type="text"
              value={projectState.release_name ?? ''}
              onChange={(event) => projectDispatch({ type: 'changed_release_name', release_name: event.target.value ?? null })} className='rounded p-2 bg-primary text-secondary'
            />
            <button
              type='button'
              disabled={!projectState.selectedProject}
              onClick={() => onUpdate(projectState)}
              className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 duration-100'
            >
              update
            </button>
          </div>
          <div>
            <p className='text-lg'>notes</p>
            <div className='flex flex-col gap-4'>
              <textarea
                value={projectState.notes ?? ''}
                onChange={(event) => projectDispatch({ type: 'changed_notes', notes: event.target.value })}
                className='rounded p-1 text-sm bg-primary text-secondary h-full'
                rows={4}
              />
              <button
                type='button'
                disabled={!projectState.selectedProject}
                onClick={() => onUpdate(projectState)}
                className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 duration-100'
              >
                update
              </button>
            </div>
          </div>
        </div>
      </div >
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <div>
          <ul className='space-y-2'>
            {contributors.map(c => (
              <li key={c.id}><button onClick={() => handleAddContributor(c)}><span className='font-bold text-accent'>{c.artist_name}</span> - {c.first_name}</button></li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
}