import useFetchData from '@/hooks/useFetchData.tsx';
import { albumReducer } from '@/reducers/albumReducer.ts';
import { Album } from '@/types.ts';
import { formatDate, generateId, saveData } from '@/utils.ts';
import { useReducer } from 'react';
import CreateAlbum from './CreateAlbum.tsx';

export default function AlbumList() {
  const [state, dispatch] = useReducer(albumReducer, { current: null, title: '', notes: '', release_date: '' });
  const { title, notes, release_date } = state;
  const { data, error, refetch } = useFetchData<Album>('http://localhost:3000/albums');

  const createAlbum = async () => {
    const id = generateId();

    try {
      await saveData(`http://localhost:3000/album/${id}`, { title, notes, release_date });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  console.log({ data, error, state });
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