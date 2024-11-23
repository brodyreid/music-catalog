import { useState } from 'react';

interface UpdateReleaseNameProps {
  onUpdateReleaseName: (releaseName: string | undefined) => void;
}

export default function UpdateReleaseName({ onUpdateReleaseName }: UpdateReleaseNameProps) {
  const [releaseName, setReleaseName] = useState<string>('');

  return (
    <div>
      <p className='text-lg'>update release_name</p>
      <div className='flex items-center gap-4'>
        <input type="text" value={releaseName} onChange={(event) => setReleaseName(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
        <button type='button' onClick={() => onUpdateReleaseName(releaseName)} className='bg-accent px-4 py-2 rounded hover:brightness-90 duration-100'>
          update
        </button>
      </div>
    </div>
  );
}