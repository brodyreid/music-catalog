interface SearchProps {
  onSearch: (term: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
  return (
    <div>
      <p className='text-lg'>search</p>
      <input type="text" onChange={(event) => onSearch(event.target.value)} className='rounded p-2 bg-primary text-secondary' />
    </div>
  );
}