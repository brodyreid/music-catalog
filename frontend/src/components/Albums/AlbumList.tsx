import { albumReducer, initialState } from '@/reducers/albumReducer.ts';
import { albumService } from '@/services/index.ts';
import { formatDate, generateId, saveData } from '@/utils.ts';
import { useEffect, useReducer } from 'react';
import CreateAlbum from './CreateAlbum.tsx';

export default function AlbumList() {
  const [state, dispatch] = useReducer(albumReducer, initialState);
  const { all: data, title, notes, release_date } = state;

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
      await saveData(`http://localhost:3000/album/${id}`, { title, notes, release_date });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CreateAlbum state={state} dispatch={dispatch} onSubmit={createAlbum} />
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
                    className='relative cursor-pointer hover'
                  >
                    <td className='text-nowrap pr-3'>{title}</td>
                    <td className='text-nowrap pr-3'>{notes}</td>
                    <td className='text-nowrap pr-3'>{release_date && formatDate(release_date)}</td>
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