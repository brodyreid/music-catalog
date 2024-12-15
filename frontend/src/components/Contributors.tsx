import { useReducer, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { contributorReducer } from '../reducers/contributorReducer.ts';
import { Contributor } from '../types.ts';
import { generateId, saveData } from '../utils.ts';
import CreateContributor from './CreateContributor.tsx';
import Button from './ui/Button.tsx';
import UpdateContributor from './UpdateContributor.tsx';

export default function Contributors() {
  const [isCreating, setIsCreating] = useState(false);
  const [state, dispatch] = useReducer(contributorReducer, { current: null, first_name: '', artist_name: '' });
  const { current, first_name, artist_name } = state;
  const { data, refetch } = useFetchData<Contributor>('http://localhost:3000/contributors');

  const createContributor = async () => {
    const id = generateId();

    try {
      await saveData(`http://localhost:3000/contributor/${id}`, { first_name, artist_name });
      refetch();
      setIsCreating(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateContributor = async () => {
    console.log('update');
  };

  return (
    <>
      {!(isCreating || state.current) &&
        <Button onClick={() => { dispatch({ type: 'set_current_contributor', contributor: null }); setIsCreating(true); }}>
          create new contributor
        </Button>}
      {isCreating && <CreateContributor dispatch={dispatch} onSubmit={createContributor} onClose={() => setIsCreating(false)} />}
      {state.current && <UpdateContributor state={state} dispatch={dispatch} onSubmit={updateContributor} onClose={() => dispatch({ type: 'set_current_contributor', contributor: null })} />}
      <div className={`flex gap-16 mt-16 ${isCreating && 'opacity-50'}`}>
        <table className="font-mono font-extralight text-sm border-separate border-spacing-2">
          <thead>
            <tr className='text-left border-b'>
              <th className='pr-3'>first_name</th>
              <th className='pr-3'>artist_name</th>
            </tr>
          </thead>
          <tbody>
            {data.map(contributor => {
              const { id, first_name, artist_name } = contributor;
              return (
                <tr
                  key={id}
                  className={`relative ${!isCreating && 'cursor-pointer hover'} ${current?.id === id && 'font-bold text-orange-300'}`}
                  onClick={() => {
                    if (isCreating) { return; }
                    dispatch({ type: 'set_current_contributor', contributor });
                  }}
                >
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
};