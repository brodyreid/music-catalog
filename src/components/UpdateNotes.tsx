import { useState } from 'react';

interface UpdateNotesProps {
  onUpdateNotes: (body: string | undefined) => void;
}

export default function UpdateNotes({ onUpdateNotes }: UpdateNotesProps) {
  const [notes, setNotes] = useState<string>('')

  return (
    <div>
      <p className='text-lg'>update notes</p>
      <div className='flex flex-col gap-4'>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className='rounded p-1 text-sm bg-primary text-secondary h-full' rows={4} />
        <button type='button' onClick={() => onUpdateNotes(notes)} className='bg-accent px-4 py-2 rounded hover:brightness-90 duration-100'>
          update
        </button>
      </div>
    </div>
  );
}