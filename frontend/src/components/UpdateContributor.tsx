import { Dispatch } from 'react';
import { ContributorActions, ContributorState } from '../reducers/contributorReducer.ts';
import TextField from './ui/TextField.tsx';

interface UpdateContributorProps {
  contributorState: ContributorState;
  contributorDispatch: Dispatch<ContributorActions>;
  onUpdate: (contributorState: ContributorState) => void;
}

export default function UpdateContributor({ contributorState, contributorDispatch, onUpdate }: UpdateContributorProps) {
  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>first_name</p>
          <TextField value={contributorState?.firstName || ''} onChange={(event) => contributorDispatch({ type: 'changed_first_name', firstName: event.target.value ?? null })} />
        </div>
        <div>
          <p>artist_name</p>
          <TextField value={contributorState?.artistName || ''} onChange={(event) => contributorDispatch({ type: 'changed_artist_name', artistName: event.target.value ?? null })} />
        </div>
        <button type='button' onClick={() => onUpdate(contributorState)} className='mt-2 bg-accent px-4 py-2 rounded hover'>
          {contributorState.selectedContributor ? 'update' : 'add'}
        </button>
      </div>
    </>
  );
}