import { useEffect, useState } from 'react';
import { Contributor } from '../types.ts';
import { generateId } from '../utils.ts';

interface UpdateContributorProps {
  selectedContributor: Contributor | null;
  onUpdateContributor: (contributor: Contributor) => void;
}

export default function UpdateContributor({ selectedContributor, onUpdateContributor }: UpdateContributorProps) {
  const [firstName, setFirstName] = useState<string>('');
  const [artistName, setArtistName] = useState<string>('');

  useEffect(() => {
    setFirstName(selectedContributor?.first_name ?? '');
    setArtistName(selectedContributor?.artist_name ?? '');
  }, [selectedContributor]);

  const handleSubmit = () => {
    if ((firstName || artistName)) {
      const id = selectedContributor ? selectedContributor.id : generateId();

      let first_name = '';
      let artist_name = '';

      if (firstName) {
        first_name = firstName;
      } else if (selectedContributor?.first_name) {
        first_name = selectedContributor.first_name;
      }

      if (artistName) {
        artist_name = artistName;
      } else if (selectedContributor?.artist_name) {
        artist_name = selectedContributor.artist_name;
      }

      onUpdateContributor({
        id,
        first_name,
        artist_name
      });
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2 w-min'>
        <div>
          <p>first_name</p>
          <input type='text' value={firstName} onChange={(event) => setFirstName(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
        </div>
        <div>
          <p>artist_name</p>
          <input type='text' value={artistName} onChange={(event) => setArtistName(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
        </div>
        <button type='button' onClick={handleSubmit} className='mt-2 bg-accent px-4 py-2 rounded hover'>
          {selectedContributor ? 'update' : 'add'}
        </button>
      </div>
    </>
  );
}