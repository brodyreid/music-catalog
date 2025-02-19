import { useTestFetch } from '@/hooks/useProjects.ts';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Test() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const {
    data: { projects, count, hasMore } = {
      projects: [],
      count: 0,
      hasMore: false,
    },
  } = useTestFetch({ page: 0, searchTerm: debouncedSearchTerm });

  return (
    <>
      <input
        type='text'
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder='Search projects...'
        className='text-sm focus:ring-0 focus:outline-none'
      />
      <p>count: {count?.toString()}</p>
      <p>hasMore: {hasMore?.toString()}</p>
      <pre className='font-normal'>
        {!projects ? 'no projects babbbyyy' : JSON.stringify(projects, null, 2)}
      </pre>
    </>
  );
}
