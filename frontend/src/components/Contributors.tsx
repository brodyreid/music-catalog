import { useReducer } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { contributorReducer } from '../reducers/contributorReducer.ts';
import { Contributor, Project } from '../types.ts';
import { saveData } from '../utils.ts';
import UpdateContributor from './UpdateContributor.tsx';

export default function Contributors() {
  const [contributorState, contributorDispatch] = useReducer(contributorReducer, { selectedContributor: null });
  const { data, refetch } = useFetchData<Contributor>('http://localhost:3000/contributors');
  const { data: contributorProjectsData } = useFetchData<Project>(`http://localhost:3000/contributor/${contributorState.selectedContributor?.id}/projects`, { skip: !contributorState.selectedContributor?.id });

  const handleSelectContributor = (contributor: Contributor) => {
    if (contributor.id === contributorState.selectedContributor?.id) {
      contributorDispatch({ type: 'set_selected_contributor', contributor: null });
    } else {
      contributorDispatch({ type: 'set_selected_contributor', contributor });
    }
  };

  const updateContributor = async (contributor: Contributor) => {
    if (!contributor) {
      console.error('No contributor.');
      return;
    }

    try {
      await saveData(`http://localhost:3000/contributor/${contributor?.id}`, { 'first_name': contributor?.first_name ?? null, 'artist_name': contributor?.artist_name ?? null });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <UpdateContributor selectedContributor={contributorState.selectedContributor} onUpdateContributor={updateContributor} />
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
                    className={`relative cursor-pointer hover ${contributorState.selectedContributor?.id === id && 'font-bold text-orange-300'}`}
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
}