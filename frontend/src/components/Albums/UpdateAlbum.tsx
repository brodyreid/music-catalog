import { AlbumActions, AlbumState } from '@/reducers/albumReducer.ts';
import { Dispatch } from 'react';
import Button from '../ui/Button.tsx';
import TextArea from '../ui/TextArea.tsx';
import TextField from '../ui/TextField.tsx';

interface UpdateAlbumProps {
  state: AlbumState;
  dispatch: Dispatch<AlbumActions>;
  onSubmit: () => void;
  onClose: () => void;
}

export default function UpdateAlbum({ state, dispatch, onSubmit, onClose }: UpdateAlbumProps) {
  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>title</p>
          <TextField value={state.title} onChange={(event) => dispatch({ type: 'changed_title', title: event.target.value ?? null })} />
        </div>
        <div>
          <p>notes</p>
          <TextArea value={state.notes} onChange={(event) => dispatch({ type: 'changed_notes', notes: event.target.value ?? null })} />
        </div>
        <div>
          <p>release_date</p>
          <TextField value={state.release_date} onChange={(event) => dispatch({ type: 'changed_release_date', release_date: event.target.value })} />
        </div>
        <div className='flex justify-between gap-4 mt-4'>
          <Button className='bg-transparent border border-primary w-full' onClick={onClose}>cancel</Button>
          <Button className='bg-green-700 w-full' onClick={onSubmit}>update</Button>
        </div>
      </div>
    </>
  );
}