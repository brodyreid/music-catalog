import useToast from '@/hooks/useToast.tsx';
import { albumReducer, initialState } from '@/reducers/albumReducer.ts';
import { albumService } from '@/services/index.ts';
import { Album, AlbumWithProjects } from '@/types.ts';
import { deleteData, formatReadableDate, generateId, saveData } from '@/utils.ts';
import { useEffect, useReducer, useState } from 'react';
import Button from '../ui/Button.tsx';
import CreateAlbum from './CreateAlbum.tsx';
import UpdateAlbum from './UpdateAlbum.tsx';

interface UpdateAlbumBody {
  title: string | null;
  notes: string | null;
  release_date: string | null;
  project_ids: string[];
}

export default function AlbumList() {
  const [isCreating, setIsCreating] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const [state, dispatch] = useReducer(albumReducer, initialState);
  const { all: data, current, title, notes, release_date, projects } = state;

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
      const response = await saveData<Album, AlbumWithProjects>(`http://localhost:3000/albums/${id}`, { title, notes, release_date });
      showToast(response.message);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateAlbum = async () => {
    if (!current) {
      console.error('No selected album');
      return;
    }
    
    try {
      const response = await saveData<UpdateAlbumBody, AlbumWithProjects>(`http://localhost:3000/albums/${current.id}`, { title, notes, release_date, project_ids: projects.map(p => p.id) });
      showToast(response.message);
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAlbum = async () => {
    if (!current) {
      console.error('No selected album');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this item?');

    if (confirmed) {
      try {
        const response = await deleteData<Album>(`http://localhost:3000/albums/${current.id}`);
        showToast(response.message);
        dispatch({ type: 'set_current', current: null });
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <ToastComponent />
      {!(isCreating || state.current) &&
        <Button onClick={() => { dispatch({ type: 'set_current', current: null }); setIsCreating(true); }}>
          create new album
        </Button>}
      {isCreating && <CreateAlbum dispatch={dispatch} onSubmit={createAlbum} onClose={() => setIsCreating(false)} />}
      {state.current && (
        <UpdateAlbum state={state} dispatch={dispatch} onSubmit={updateAlbum} onDelete={deleteAlbum} onClose={() => dispatch({ type: 'set_current', current: null })} />
      )}
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