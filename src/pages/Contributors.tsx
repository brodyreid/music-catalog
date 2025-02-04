import { contributorReducer, initialState } from '@/reducers/contributorReducer.ts';
import supabase from '@/supabase.ts';
import { useEffect, useReducer } from 'react';

export default function Contributors() {
  const [state, dispatch] = useReducer(contributorReducer, initialState);
  const { all: data, current } = state;

  useEffect(() => {
    const getContributors = async () => {
      const { data, error } = await supabase.from('contributors').select(`
        *
        `);
      if (error) {
        throw error;
      }

      dispatch({ type: 'set_all', all: data });
    };

    getContributors();
  }, []);

  return (
    <>
      <div className={`flex gap-16 mt-16`}>
        <table className='text-sm border-separate border-spacing-2'>
          <thead>
            <tr className='text-left border-b'>
              <th className='pr-3'>first_name</th>
              <th className='pr-3'>artist_name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((contributor) => {
              const { id, first_name, artist_name } = contributor;
              return (
                <tr
                  key={id}
                  className={`relative cursor-pointer hover ${current?.id === id && 'font-bold text-orange-300'}`}
                  onClick={() => {
                    dispatch({ type: 'set_current', current: contributor });
                  }}>
                  <td className='text-nowrap pr-3'>{first_name}</td>
                  <td className='text-nowrap pr-3'>{artist_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
