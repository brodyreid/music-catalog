import { useReducer } from 'react';
import useFetchData from '../hooks/useFetchData.tsx';
import { albumReducer } from '../reducers/albumReducer.ts';
import { Album } from '../types.ts';

export default function Albums() {
  const [albumState] = useReducer(albumReducer, { selectedAlbum: null });
  const { data } = useFetchData<Album>('http://localhost:3000/albums');
  // const { data: contributorProjectsData } = useFetchData<Project>(albumState.selectedAlbum?.id ? `http://localhost:3000/contributor/${albumState.selectedAlbum.id}/projects` : null, { skip: !albumState.selectedAlbum?.id });

  // const handleSelectContributor = (contributor: Contributor) => {
  //   if (contributor.id === albumState.selectedAlbum?.id) {
  //     contributorDispatch({ type: 'set_selected_contributor', contributor: null });
  //   } else {
  //     contributorDispatch({ type: 'set_selected_contributor', contributor });
  //   }
  // };

  // const updateContributor = async (contributor: Contributor) => {
  //   if (!contributor) {
  //     console.error('No contributor.');
  //     return;
  //   }

  //   try {
  //     await saveData(`http://localhost:3000/contributor/${contributor?.id}`, { 'first_name': contributor?.first_name ?? null, 'artist_name': contributor?.artist_name ?? null });
  //     refetch();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
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
              {data.map(album => {
                const { id, title, notes, release_date } = album;

                return (
                  <tr
                    key={id}
                    className={`relative cursor-pointer hover ${albumState.selectedAlbum?.id === id && 'font-bold text-orange-300'}`}
                  // onClick={() => handleSelectContributor(contributor)}
                  >
                    <td className='text-nowrap pr-3'>{title}</td>
                    <td className='text-nowrap pr-3'>{notes}</td>
                    <td className='text-nowrap pr-3'>{release_date}</td>
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