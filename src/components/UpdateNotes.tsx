import { useState } from 'react';
import { Project } from '../types.ts';

interface UpdateNotesProps {
  selectedProject?: Project;
  onUpdateNotes: (body: string) => void;
}

export default function UpdateNotes({ selectedProject, onUpdateNotes }: UpdateNotesProps) {
  const [notes, setNotes] = useState<string>('');

  return (
    <div>
      <p className='text-lg'>update notes</p>
      <div className='flex flex-col gap-4'>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className='rounded p-1 text-sm bg-primary text-secondary h-full' rows={4} />
        <button type='button' disabled={!selectedProject} onClick={() => onUpdateNotes(notes)} className='bg-accent px-4 py-2 rounded disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 duration-100'>
          update
        </button>
      </div>
    </div>
  );
}