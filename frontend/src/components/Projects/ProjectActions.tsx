import SelectField from '@/components/ui/SelectField.tsx';
import TextArea from '@/components/ui/TextArea.tsx';
import TextField from '@/components/ui/TextField.tsx';
import { ProjectActions, ProjectState } from '@/reducers/projectReducer.ts';
import { MusicalKey } from '@/types.ts';
import { Dispatch } from 'react';
import ProjectContributors from './ProjectContributors.tsx';

interface ProjectActionsProps {
  state: ProjectState;
  dispatch: Dispatch<ProjectActions>;
  onUpdate: (state: ProjectState) => void;
}

export default function ProjectActions({ state, dispatch, onUpdate }: ProjectActionsProps) {
  return (
    <div>
      {state.current && <p className='text-lg text-orange-300'>{state.current.title}</p>}
      <div className={`grid grid-cols-3 gap-x-8 p-4 border border-neutral-500 rounded-lg ${!state.current ? 'pointer-events-none opacity-50' : ''}`}>
        <div className='flex flex-col justify-between min-w-64'>
          <div>
            <p className='text-lg'>contributors</p>
            <ProjectContributors state={state} dispatch={dispatch} />
          </div>
          <button type='button' disabled={!state.current} onClick={() => onUpdate(state)} className='bg-accent px-4 py-2 rounded-sm disabled:pointer-events-none disabled:opacity-50 hover'>
            update
          </button>
        </div>
        <div>
          <p className='text-lg'>release_name</p>
          <TextField value={state.release_name ?? ''} onChange={(event) => dispatch({ type: 'changed_release_name', release_name: event.target.value ?? null })} className='w-full' />
          <p className='text-lg'>notes</p>
          <div className='flex flex-col'>
            <TextArea value={state.notes ?? ''} onChange={(event) => dispatch({ type: 'changed_notes', notes: event.target.value })} />
          </div>
        </div>
        <div>
          <p className='text-lg'>bpm</p>
          <TextField value={state.bpm?.toString() ?? ''} onChange={(event) => dispatch({ type: 'changed_bpm', bpm: parseInt(event.target.value) ?? null })} className='w-full' />
          <p className='text-lg'>musical_key</p>
          <SelectField value={state.musical_key ?? ''} onChange={(event) => dispatch({ type: 'changed_musical_key', musical_key: (event.target.value as MusicalKey) ?? null })}>
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
