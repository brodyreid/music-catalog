import RotateCw from '@/icons/RotateCw.tsx';

interface SearchProps {
  onSearch: (term: string) => void;
  currentSearchTerm: string;
  onReset?: () => void;
}

export default function Search({ onSearch, currentSearchTerm, onReset }: SearchProps) {
  return (
    <div>
      <p className='text-lg'>search</p>
      <div className='flex items-center'>
        <input type="text" value={currentSearchTerm} onChange={(event) => onSearch(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
        {onReset && <button className='ml-4 hover' onClick={onReset}><RotateCw className='w-5' /></button>}
      </div>
    </div>
  );
}