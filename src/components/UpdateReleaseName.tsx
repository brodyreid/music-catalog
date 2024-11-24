import { useEffect, useState } from 'react';
import { Project } from '../types.ts';

interface UpdateReleaseNameProps {
  selectedProject?: Project;
  onUpdateReleaseName: (releaseName: string) => void;
}

export default function UpdateReleaseName({ selectedProject, onUpdateReleaseName }: UpdateReleaseNameProps) {
  const [releaseName, setReleaseName] = useState<string>('');

  useEffect(() => {
    setReleaseName(selectedProject?.release_name ?? '');
  }, [selectedProject]);

  return (
    <div>
      <p className='text-lg'>update release_name</p>
      <div className='flex items-center gap-4'>
        <input type="text" value={releaseName} onChange={(event) => setReleaseName(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
        <button type='button' disabled={!selectedProject} onClick={() => onUpdateReleaseName(releaseName)} className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 duration-100'>
          update
        </button>
      </div>
    </div>
  );
}