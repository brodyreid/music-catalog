import { Dispatch } from 'react';
import { AlbumActions, AlbumState } from '../reducers/albumReducer.ts';

interface UpdateAlbumProps {
  albumState: AlbumState;
  albumDispatch: Dispatch<AlbumActions>;
  onUpdate: (albumState: AlbumState) => void;
}

export default function UpdateAlbum({ albumState, albumDispatch, onUpdate }: UpdateAlbumProps) {
  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>title</p>
          <input type='text' value={albumState.selectedAlbum?.title || ''} onChange={(event) => albumDispatch({ type: 'changed_title', title: event.target.value ?? null })} className='rounded p-2 bg-primary text-secondary' />
        </div>
        <div>
          <p>notes</p>
          <input type='text' value={albumState.selectedAlbum?.notes || ''} onChange={(event) => albumDispatch({ type: 'changed_notes', notes: event.target.value ?? null })} className='rounded p-2 bg-primary text-secondary' />
        </div>
        <div>
          <p>release_date</p>
          <input type='text' value={albumState.selectedAlbum?.release_date || ''} onChange={(event) => albumDispatch({ type: 'changed_release_date', release_date: event.target.value })} className='rounded p-2 bg-primary text-secondary' />
        </div>
        <button type='button' onClick={() => onUpdate(albumState)} className='mt-2 bg-accent px-4 py-2 rounded hover'>
          {albumState.selectedAlbum ? 'update' : 'add'}
        </button>
      </div>
    </>
  );
}