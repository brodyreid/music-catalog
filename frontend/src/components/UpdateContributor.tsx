import { Dispatch } from 'react';
import { ContributorActions, ContributorState } from '../reducers/contributorReducer.ts';
import Button from './ui/Button.tsx';
import TextField from './ui/TextField.tsx';

interface UpdateContributorProps {
  state: ContributorState;
  dispatch: Dispatch<ContributorActions>;
  onUpdate: (contributorState: ContributorState) => void;
}

export default function UpdateContributor({ state, dispatch, onUpdate }: UpdateContributorProps) {
  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>first_name</p>
          <TextField value={state?.first_name || ''} onChange={(event) => dispatch({ type: 'changed_first_name', first_name: event.target.value })} />
        </div>
        <div>
          <p>artist_name</p>
          <TextField value={state?.artist_name || ''} onChange={(event) => dispatch({ type: 'changed_artist_name', artist_name: event.target.value })} />
        </div>
        <Button onClick={() => onUpdate(state)} className='mt-2 bg-green-700'>update</Button>
      </div>
    </>
  );
}