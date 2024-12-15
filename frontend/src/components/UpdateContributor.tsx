import { Dispatch } from 'react';
import { ContributorActions, ContributorState } from '../reducers/contributorReducer.ts';
import Button from './ui/Button.tsx';
import TextField from './ui/TextField.tsx';

interface UpdateContributorProps {
  state: ContributorState;
  dispatch: Dispatch<ContributorActions>;
  onSubmit: () => void;
  onClose: () => void;
}

export default function UpdateContributor({ state, dispatch, onSubmit, onClose }: UpdateContributorProps) {
  console.log({ state });
  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>first_name</p>
          <TextField value={state.first_name} onChange={(event) => dispatch({ type: 'changed_first_name', first_name: event.target.value })} />
        </div>
        <div>
          <p>artist_name</p>
          <TextField value={state.artist_name} onChange={(event) => dispatch({ type: 'changed_artist_name', artist_name: event.target.value })} />
        </div>
        <div className='flex justify-between gap-4 mt-4'>
          <Button className='bg-transparent border border-primary w-full' onClick={onClose}>cancel</Button>
          <Button className='bg-green-700 w-full' onClick={onSubmit}>update</Button>
        </div>
      </div>
    </>
  );
}