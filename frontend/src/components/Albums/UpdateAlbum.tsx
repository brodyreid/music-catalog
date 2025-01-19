import Button from '@/components/ui/Button.tsx';
import DateField from '@/components/ui/DateField.tsx';
import TextArea from '@/components/ui/TextArea.tsx';
import TextField from '@/components/ui/TextField.tsx';
import Trash from '@/icons/Trash.tsx';
import { AlbumActions, AlbumState } from '@/reducers/albumReducer.ts';
import { formatNumericDate } from '@/utils.ts';
import { Dispatch } from 'react';
import AlbumProjects from './AlbumProjects.tsx';

interface UpdateAlbumProps {
  state: AlbumState;
  dispatch: Dispatch<AlbumActions>;
  onSubmit: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export default function UpdateAlbum({ state, dispatch, onSubmit, onClose, onDelete }: UpdateAlbumProps) {
  return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>title</p>
          <TextField value={state.title ?? ''} onChange={(event) => dispatch({ type: 'changed_title', title: event.target.value ?? null })} />
        </div>
        <div>
          <p>notes</p>
          <TextArea value={state.notes ?? ''} onChange={(event) => dispatch({ type: 'changed_notes', notes: event.target.value ?? null })} className='w-full' />
        </div>
        <div>
          <p>release_date</p>
          <DateField value={formatNumericDate(state.release_date)} onChange={(event) => dispatch({ type: 'changed_release_date', release_date: event.target.value })} className='w-full' />
        </div>
        <div className='flex justify-between gap-4 mt-4'>
          <Button className='bg-transparent border border-primary w-full' onClick={onClose}>cancel</Button>
          <Button className='bg-green-700 w-full' onClick={onSubmit}>update</Button>
        </div>
        <Button className='bg-transparent border border-red-600 mt-2 flex gap-2 justify-center items-center text-red-600' onClick={onDelete}>
          <Trash className='w-4' />delete
        </Button>
      </div>
      <AlbumProjects state={state} dispatch={dispatch} />
    </div>
  );
}