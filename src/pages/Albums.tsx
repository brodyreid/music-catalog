import Button from '@/components/Button.tsx';
import { albumReducer, initialState } from '@/reducers/albumReducer.ts';
import supabase from '@/supabase.ts';
import { formatReadableDate } from '@/utils.ts';
import { useEffect, useReducer, useState } from 'react';

export default function Albums() {
  const [isCreating, setIsCreating] = useState(false);
  const [state, dispatch] = useReducer(albumReducer, initialState);
  const { all: data, current } = state;

  useEffect(() => {
    const getAlbums = async () => {
      const { data, error } = await supabase.from('albums').select(`
        *,
        projects ( * )
        `);
      if (error) {
        throw error;
      }

      dispatch({ type: 'set_all', all: data });
    };

    getAlbums();
  }, []);

  return (
    <>
      {!(isCreating || state.current) && (
        <Button
          onClick={() => {
            dispatch({ type: 'set_current', current: null });
            setIsCreating(true);
          }}>
          create new album
        </Button>
      )}
      <div className='flex gap-16 mt-16'>
        <div>
          <table className='font-mono font-extralight text-sm border-separate border-spacing-2'>
            <thead>
              <tr className='text-left border-b'>
                <th className='pr-3'>title</th>
                <th className='pr-3'>notes</th>
                <th className='pr-3'>release_date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((album) => {
                const { id, title, notes, release_date } = album;

                return (
                  <tr
                    key={id}
                    className={`relative ${!isCreating && 'cursor-pointer hover'} ${current?.id === id && 'font-bold text-orange-300'}`}
                    onClick={() => {
                      if (isCreating) {
                        return;
                      }
                      dispatch({ type: 'set_current', current: album });
                    }}>
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
