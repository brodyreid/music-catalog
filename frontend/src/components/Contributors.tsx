import { useReducer, useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { contributorReducer } from '../reducers/contributorReducer.ts';
import { Contributor, Project } from '../types.ts';
import { generateId, saveData } from '../utils.ts';
import CreateContributor from './CreateContributor.tsx';
import Button from './ui/Button.tsx';

export default function Contributors() {
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [state, dispatch] = useReducer(contributorReducer, { current: null, first_name: null, artist_name: null });
  const { current, first_name, artist_name } = state;
  const { data, refetch } = useFetchData<Contributor>('http://localhost:3000/contributors');
  const { data: contributorProjectsData } = useFetchData<Project>(current?.id ? `http://localhost:3000/contributor/${current.id}/projects` : null, { skip: !current?.id });

  const handleSelectContributor = (contributor: Contributor) => {
    if (contributor.id === current?.id) {
      dispatch({ type: 'set_current_contributor', contributor: null });
    } else {
      dispatch({ type: 'set_current_contributor', contributor });
    }
  };

  const createContributor = async () => {
    const id = generateId();

    try {
      await saveData(`http://localhost:3000/contributor/${id}`, { first_name, artist_name });
      refetch();
      setIsCreateVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!isCreateVisible && <Button onClick={() => setIsCreateVisible(true)}>create new contributor</Button>}
      {isCreateVisible && <CreateContributor state={state} dispatch={dispatch} onSubmit={createContributor} onClose={() => setIsCreateVisible(false)} />}
      {/* <UpdateContributor state={state} contributorDispatch={contributorDispatch} onUpdate={updateContributor} /> */}
      <div className='flex gap-16 mt-16'>
        <div>
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
                    className={`relative cursor-pointer hover ${current?.id === id && 'font-bold text-orange-300'}`}
                    onClick={() => handleSelectContributor(contributor)}
                  >
                    <td className='text-nowrap pr-3'>{first_name}</td>
                    <td className='text-nowrap pr-3'>{artist_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <table className="font-mono font-extralight text-sm border-separate border-spacing-2">
            <thead>
              <tr className='text-left border-b'>
                <th className='pr-3'>title</th>
                <th className='pr-3'>release_name</th>
              </tr>
            </thead>
            <tbody>
              {contributorProjectsData.map(p => {
                const { id, title, release_name } = p;

                return (
                  <tr key={id}>
                    <td className='text-nowrap pr-3'>{title}</td>
                    <td className='text-nowrap pr-3'>{release_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};