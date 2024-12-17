import Button from '@/components/ui/Button.tsx';
import useToast from '@/hooks/useToast.tsx';
import { contributorReducer } from '@/reducers/contributorReducer.ts';
import { contributorService } from '@/services/index.ts';
import { Contributor } from '@/types.ts';
import { deleteData, generateId, saveData } from '@/utils.ts';
import { useEffect, useReducer, useState } from 'react';
import CreateContributor from './CreateContributor.tsx';
import UpdateContributor from './UpdateContributor.tsx';

interface UpdateContributorBody {
  first_name: string | null;
  artist_name: string | null;
}

interface ContributorResponse {
  message: string;
  contributor: Contributor;
}

export default function ContributorList() {
  const [isCreating, setIsCreating] = useState(false);
  const [state, dispatch] = useReducer(contributorReducer, { current: null, first_name: '', artist_name: '' });
  const { current, first_name, artist_name } = state;
  const { showToast, ToastComponent } = useToast();
  const [data, setData] = useState<Contributor[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const egg = await contributorService.getAll();
      setData(egg);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createContributor = async () => {
    const id = generateId();

    try {
      await saveData(`http://localhost:3000/contributor/${id}`, { first_name, artist_name });
      fetchData();
      setIsCreating(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateContributor = async () => {
    if (!current) {
      console.error('No selected contributor');
      return;
    }

    try {
      const response = await saveData<UpdateContributorBody, ContributorResponse>(`http://localhost:3000/contributor/${current?.id}`, { first_name, artist_name });

      showToast(response.message + ': ' + response.contributor.first_name + ' ' + response.contributor.artist_name);
      dispatch({ type: 'set_current_contributor', contributor: null });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContributor = async () => {
    if (!current) {
      console.error('No selected contributor');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this item?');

    if (confirmed) {
      try {
        const response = await deleteData<ContributorResponse>(`http://localhost:3000/contributor/${current?.id}`);
        showToast(response.message);
        dispatch({ type: 'set_current_contributor', contributor: null });
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
        <Button onClick={() => { dispatch({ type: 'set_current_contributor', contributor: null }); setIsCreating(true); }}>
          create new contributor
        </Button>}
      {isCreating && <CreateContributor dispatch={dispatch} onSubmit={createContributor} onClose={() => setIsCreating(false)} />}
      {state.current && <UpdateContributor state={state} dispatch={dispatch} onSubmit={updateContributor} onDelete={deleteContributor} onClose={() => dispatch({ type: 'set_current_contributor', contributor: null })} />}
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