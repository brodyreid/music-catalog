import Button from '@/components/ui/Button.tsx';
import TextArea from '@/components/ui/TextArea.tsx';
import TextField from '@/components/ui/TextField.tsx';
import { AlbumActions, AlbumState } from '@/reducers/albumReducer.ts';
import { formatNumericDate } from '@/utils.ts';
import { Dispatch } from 'react';
import DateField from '../ui/DateField.tsx';

interface UpdateAlbumProps {
  state: AlbumState;
  dispatch: Dispatch<AlbumActions>;
  onSubmit: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export default function UpdateAlbum({ state, dispatch, onSubmit, onClose }: UpdateAlbumProps) {
  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>title</p>
          <TextField value={state.title ?? ''} onChange={(event) => dispatch({ type: 'changed_title', title: event.target.value ?? null })} />
        </div>
        <div>
          <p>notes</p>
          <TextArea value={state.notes ?? ''} onChange={(event) => dispatch({ type: 'changed_notes', notes: event.target.value ?? null })} />
        </div>
        <div>
          <p>release_date</p>
          <DateField value={formatNumericDate(state.release_date)} onChange={(event) => dispatch({ type: 'changed_release_date', release_date: event.target.value })} />
        </div>
        <div className='flex justify-between gap-4 mt-4'>
          <Button className='bg-transparent border border-primary w-full' onClick={onClose}>cancel</Button>
          <Button className='bg-green-700 w-full' onClick={onSubmit}>update</Button>
        </div>
      </div>
    </>
  );
}