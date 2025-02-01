import Button from '@/components/ui/Button.tsx';
import TextField from '@/components/ui/TextField.tsx';
import Trash from '@/icons/Trash.tsx';
import { ContributorActions, ContributorState } from '@/reducers/contributorReducer.ts';
import { Dispatch } from 'react';

interface UpdateContributorProps {
  state: ContributorState;
  dispatch: Dispatch<ContributorActions>;
  onSubmit: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export default function UpdateContributor({ state, dispatch, onSubmit, onClose, onDelete }: UpdateContributorProps) {
  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>first_name</p>
          <TextField value={state.first_name ?? ''} onChange={(event) => dispatch({ type: 'changed_first_name', first_name: event.target.value })} />
        </div>
        <div>
          <p>artist_name</p>
          <TextField value={state.artist_name ?? ''} onChange={(event) => dispatch({ type: 'changed_artist_name', artist_name: event.target.value })} />
        </div>
        <div className='flex justify-between gap-4 mt-2'>
          <Button className='bg-transparent border border-primary w-full' onClick={onClose}>
            cancel
          </Button>
          <Button className='bg-green-700 w-full' onClick={onSubmit}>
            update
          </Button>
        </div>
        <Button className='bg-transparent border border-red-600 mt-2 flex gap-2 justify-center items-center text-red-600' onClick={onDelete}>
          <Trash className='w-4' />
          delete
        </Button>
      </div>
    </>
  );
}
