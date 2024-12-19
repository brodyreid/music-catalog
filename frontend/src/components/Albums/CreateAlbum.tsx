import Button from '@/components/ui/Button.tsx';
import DateField from '@/components/ui/DateField.tsx';
import TextArea from '@/components/ui/TextArea.tsx';
import TextField from '@/components/ui/TextField.tsx';
import { AlbumActions } from '@/reducers/albumReducer.ts';
import { Dispatch } from 'react';

interface CreateAlbumProps {
  dispatch: Dispatch<AlbumActions>;
  onSubmit: () => void;
  onClose: () => void;
}

export default function CreateAlbum({ dispatch, onSubmit, onClose }: CreateAlbumProps) {
  return (
    <div className='flex flex-col max-w-64'>
      <p>title</p>
      <TextField onChange={(event) => dispatch({ type: 'changed_title', title: event.target.value ?? null })} />
      <p className='mt-2'>notes</p>
      <TextArea onChange={(event) => dispatch({ type: 'changed_notes', notes: event.target.value ?? null })} />
      <p className='mt-2'>release_date</p>
      <DateField onChange={(event) => dispatch({ type: 'changed_release_date', release_date: event.target.value })} />
      <div className='flex justify-between gap-4 mt-4'>
        <Button className='bg-transparent border border-primary w-full' onClick={onClose}>cancel</Button>
        <Button className='bg-green-700 w-full' onClick={onSubmit}>create</Button>
      </div>
    </div>
  );
}