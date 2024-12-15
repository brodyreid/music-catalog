import SelectField from '@/components/ui/SelectField.tsx';
import TextArea from '@/components/ui/TextArea.tsx';
import TextField from '@/components/ui/TextField.tsx';
import { ProjectActions, ProjectState } from '@/reducers/projectReducer.ts';
import { MusicalKey } from '@/types.ts';
import { Dispatch } from 'react';
import ProjectContributors from './ProjectContributors.tsx';


interface ProjectActionsProps {
  projectState: ProjectState;
  projectDispatch: Dispatch<ProjectActions>;
  onUpdate: (projectState: ProjectState) => void;
}

export default function ProjectActions({ projectState, projectDispatch, onUpdate }: ProjectActionsProps) {
  return (
    <div>
      {projectState.selectedProject && (
        <p className='text-lg text-orange-300'>{projectState.selectedProject.title}</p>
      )}
      <div className={`grid grid-cols-3 gap-x-8 p-8 pt-6 border border-neutral-500 rounded-lg ${!projectState.selectedProject ? 'pointer-events-none opacity-50' : ''}`}>
        <div className='flex flex-col justify-between min-w-64'>
          <div>
            <p className='text-lg'>contributors</p>
            <ProjectContributors projectState={projectState} projectDispatch={projectDispatch} />
          </div>
          <button
            type='button'
            disabled={!projectState.selectedProject}
            onClick={() => onUpdate(projectState)}
            className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover'
          >
            update
          </button>
        </div>
        <div>
          <p className='text-lg'>release_name</p>
          <TextField
            value={projectState.release_name ?? ''}
            onChange={(event) => projectDispatch({ type: 'changed_release_name', release_name: event.target.value ?? null })}
          />
          <p className='text-lg'>notes</p>
          <div className='flex flex-col'>
            <TextArea
              value={projectState.notes ?? ''}
              onChange={(event) => projectDispatch({ type: 'changed_notes', notes: event.target.value })}

            />
          </div>
        </div>
        <div>
          <p className='text-lg'>bpm</p>
          <TextField
            value={projectState.bpm?.toString() ?? ''}
            onChange={(event) => projectDispatch({ type: 'changed_bpm', bpm: parseInt(event.target.value) ?? null })} />
          <p className='text-lg'>musical_key</p>
          <SelectField
            value={projectState.musical_key ?? ''}
            onChange={(event) => projectDispatch({ type: 'changed_musical_key', musical_key: event.target.value as MusicalKey ?? null })}
          >
            <option>{null}</option>
            {Object.values(MusicalKey).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </SelectField>
        </div>
      </div>
    </div>
  );
}