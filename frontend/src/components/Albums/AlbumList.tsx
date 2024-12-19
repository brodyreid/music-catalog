import useToast from '@/hooks/useToast.tsx';
import { albumReducer, initialState } from '@/reducers/albumReducer.ts';
import { albumService } from '@/services/index.ts';
import { Album } from '@/types.ts';
import { formatReadableDate, generateId, saveData } from '@/utils.ts';
import { useEffect, useReducer, useState } from 'react';
import Button from '../ui/Button.tsx';
import CreateAlbum from './CreateAlbum.tsx';
import UpdateAlbum from './UpdateAlbum.tsx';

export default function AlbumList() {
  const [isCreating, setIsCreating] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const [state, dispatch] = useReducer(albumReducer, initialState);
  const { all: data, current, title, notes, release_date } = state;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await albumService.getAll();
      dispatch({ type: 'set_all', all: response });
    } catch (error) {
      console.error(error);
    }
  };

  const createAlbum = async () => {
    const id = generateId();

    try {
      const response = await saveData<Album, Album>(`http://localhost:3000/album/${id}`, { title, notes, release_date });
      showToast(response.message);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateAlbum = async () => {
    console.log('updated');
  };

  const deleteAlbum = async () => {
    console.log('updated');
  };

  return (
    <>
      <ToastComponent />
      {!(isCreating || state.current) &&
        <Button onClick={() => { dispatch({ type: 'set_current', current: null }); setIsCreating(true); }}>
          create new album
        </Button>}
      {isCreating && <CreateAlbum dispatch={dispatch} onSubmit={createAlbum} onClose={() => setIsCreating(false)} />}
      {state.current && <UpdateAlbum state={state} dispatch={dispatch} onSubmit={updateAlbum} onDelete={deleteAlbum} onClose={() => dispatch({ type: 'set_current', current: null })} />}
      <div className='flex gap-16 mt-16'>
        <div>
          <table className="font-mono font-extralight text-sm border-separate border-spacing-2">
            <thead>
              <tr className='text-left border-b'>
                <th className='pr-3'>title</th>
                <th className='pr-3'>notes</th>
                <th className='pr-3'>release_date</th>
              </tr>
            </thead>
            <tbody>
              {data.map(album => {
                const { id, title, notes, release_date } = album;

                return (
                  <tr
                    key={id}
                    className={`relative ${!isCreating && 'cursor-pointer hover'} ${current?.id === id && 'font-bold text-orange-300'}`}
                    onClick={() => {
                      if (isCreating) { return; }
                      dispatch({ type: 'set_current', current: album });
                    }}
                  >
                    <td className='text-nowrap pr-3'>{title}</td>
                    <td className='text-nowrap pr-3'>{notes}</td>
                    <td className='text-nowrap pr-3'>{release_date && formatReadableDate(release_date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}