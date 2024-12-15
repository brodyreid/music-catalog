import Button from '@/components/ui/Button.tsx';
import DateField from '@/components/ui/DateField.tsx';
import TextArea from '@/components/ui/TextArea.tsx';
import TextField from '@/components/ui/TextField.tsx';
import { AlbumActions, AlbumState } from '@/reducers/albumReducer.ts';
import { Dispatch } from 'react';

interface CreateAlbumProps {
  state: AlbumState;
  dispatch: Dispatch<AlbumActions>;
  onSubmit: () => void;
}

export default function CreateAlbum({ dispatch, onSubmit }: CreateAlbumProps) {
  return (
    <div className='flex flex-col max-w-64'>
      <p>title</p>
      <TextField onChange={(event) => dispatch({ type: 'changed_title', title: event.target.value ?? null })} />
      <p className='mt-2'>notes</p>
      <TextArea onChange={(event) => dispatch({ type: 'changed_notes', notes: event.target.value ?? null })} />
      <p className='mt-2'>release_date</p>
      <DateField onChange={(event) => dispatch({ type: 'changed_release_date', release_date: event.target.value })} />
      <Button className='mt-4' onClick={onSubmit}>create</Button>
    </div>
  );
}