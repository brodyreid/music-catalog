import { useState } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { Contributor } from '../types.ts';
import { saveData } from '../utils.ts';
import UpdateContributor from './UpdateContributor.tsx';

export default function Contributors() {
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const { data, refetch } = useFetchData<Contributor>('http://localhost:3000/contributors');

  const handleSelectContributor = (contributor: Contributor) => {
    if (contributor.id === selectedContributor?.id) {
      setSelectedContributor(null);
    } else {
      setSelectedContributor({ ...contributor });
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
      <UpdateContributor selectedContributor={selectedContributor} onUpdateContributor={updateContributor} />
      <div className="mt-16">
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
                  className={`relative cursor-pointer hover ${selectedContributor?.id === id && 'font-bold text-orange-300'}`}
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
    </>
  );
}