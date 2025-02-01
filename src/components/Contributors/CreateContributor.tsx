import Button from '@/components/ui/Button.tsx';
import TextField from '@/components/ui/TextField.tsx';
import { ContributorActions } from '@/reducers/contributorReducer.ts';
import { Dispatch } from 'react';

interface CreateContributorProps {
  dispatch: Dispatch<ContributorActions>;
  onSubmit: () => void;
  onClose: () => void;
}

export default function CreateContributor({ dispatch, onSubmit, onClose }: CreateContributorProps) {
  return (
    <div className='flex flex-col max-w-64'>
      <p>first_name</p>
      <TextField onChange={(event) => dispatch({ type: 'changed_first_name', first_name: event.target.value })} />
      <p className='mt-2'>artist_name</p>
      <TextField onChange={(event) => dispatch({ type: 'changed_artist_name', artist_name: event.target.value })} />
      <div className='flex justify-between gap-4 mt-4'>
        <Button className='bg-transparent border border-primary w-full' onClick={onClose}>
          cancel
        </Button>
        <Button className='bg-green-700 w-full' onClick={onSubmit}>
          create
        </Button>
      </div>
    </div>
  );
}
