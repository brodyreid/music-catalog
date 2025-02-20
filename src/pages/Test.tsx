import { useTestFetch } from '@/hooks/useProjects.ts';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Test() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm, { isPending }] = useDebounce(searchTerm, 500);
  const {
    data: { projects, count, hasMore } = {
      projects: [],
      count: 0,
      hasMore: false,
    },
  } = useTestFetch({ page: 0, searchTerm: debouncedSearchTerm });

  useEffect(() => {
    setIsSearching(isPending());
  }, [searchTerm, debouncedSearchTerm]);

  return (
    <>
      <div className='py-4 flex items-center px-4 border-b border-border'>
        <div className='ml-auto'>
          <div className='border ring-border has-focus:ring-2 has-focus-visible:ring-text-muted/30 has-focus-visible:border-text/50 has-focus-visible:shadow-lg outline-none w-56 py-1.5 pl-1.5 border-border flex items-center gap-1 rounded-md bg-background-mid/65'>
            <span className='flex items-center justify-center w-4 h-4 leading-4'>
              {isSearching ? (
                <span className='w-4 h-4 border-[1.5px] border-text-muted/20 border-t-text-muted/75 rounded-full animate-spin' />
              ) : (
                <Search className='text-text-muted/50' strokeWidth={1.25} size={16} />
              )}
            </span>
            <input
              type='text'
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Search projects...'
              className='text-sm focus:ring-0 focus:outline-none'
            />
          </div>
        </div>
      </div>
      <p>count: {count?.toString()}</p>
      <p>hasMore: {hasMore?.toString()}</p>
      <pre className='font-normal'>
        {!projects ? 'no projects babbbyyy' : JSON.stringify(projects, null, 2)}
      </pre>
    </>
  );
}
