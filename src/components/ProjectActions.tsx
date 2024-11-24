import { Dispatch } from 'react';
import { ProjectState } from '../reducers/projectReducer.ts';
import { ProjectActions } from '../types.ts';

interface ProjectActionsProps {
  projectState: ProjectState;
  projectDispatch: Dispatch<ProjectActions>;
  onUpdate: (projectState: ProjectState) => void;
}

export default function ProjectActions({ projectState, projectDispatch, onUpdate }: ProjectActionsProps) {
  console.log(projectState);
  return (
    <>
      <div>
        <p className='text-lg'>release_name</p>
        <div className='flex items-center gap-4'>
          <input
            type="text"
            value={projectState.release_name ?? ''}
            onChange={(event) => projectDispatch({ type: 'updated_release_name', release_name: event.target.value ?? null })} className='rounded p-2 bg-primary text-secondary'
          />
          <button
            type='button'
            disabled={!projectState}
            onClick={() => onUpdate(projectState)}
            className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 duration-100'
          >
            update
          </button>
        </div>
      </div>
      <div>
        <p className='text-lg'>notes</p>
        <div className='flex flex-col gap-4'>
          <textarea
            value={projectState.notes ?? ''}
            onChange={(event) => projectDispatch({ type: 'updated_notes', notes: event.target.value })}
            className='rounded p-1 text-sm bg-primary text-secondary h-full'
            rows={4}
          />
          <button
            type='button'
            disabled={!projectState}
            onClick={() => onUpdate(projectState)}
            className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 duration-100'
          >
            update
          </button>
        </div>
      </div>
    </>
  );
}