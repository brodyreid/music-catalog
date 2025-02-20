import { PAGE_SIZE } from '@/api/projectQueries.ts';
import ErrorMessage from '@/components/ErrorMessage.tsx';
import LoadingBars from '@/components/LoadingBars.tsx';
import { useTestFetch } from '@/hooks/useProjects.ts';
import { Project } from '@/types/index.ts';
import { formatReadableDate } from '@/utils.ts';
import { ArrowLeft, ArrowRight, Minus, Pencil, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Test() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm, { isPending }] = useDebounce(searchTerm, 500);
  const {
    data: { projects, count, hasMore } = {
      projects: [],
      count: 0,
      hasMore: false,
    },
    isLoading,
    error,
  } = useTestFetch({ page, searchTerm: debouncedSearchTerm });

  useEffect(() => {
    setIsSearching(isPending());
  }, [searchTerm, debouncedSearchTerm]);

  const handleEdit = (project: Project) => {
    console.log(project);
  };

  const handlePageDecrement = () => {
    if (page <= 0) {
      return;
    }
    setPage((prev) => prev - 1);
  };

  const handlePageIncrement = () => {
    if (!hasMore) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  if (isLoading) return <LoadingBars />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      {/* Topbar */}
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

      {/* Table */}
      <div className='overflow-auto max-h-screen'>
        <table className='text-sm table-auto border-collapse border-spacing-0'>
          <thead>
            <tr className='text-left bg-background-mid sticky top-0'>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-l-0 border-border'></th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Title
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Folder Path
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Release Name
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Contributors
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Notes
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td
                  className='text-nowrap p-2 border border-l-0 border-border hover hover:bg-background-mid'
                  onClick={() => handleEdit(project)}>
                  <Pencil size={12} strokeWidth={1.25} />
                </td>
                <td className='text-nowrap p-2 border border-border'>{project.title}</td>
                <td className='text-nowrap p-2 border border-border'>
                  {project.path || (
                    <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />
                  )}
                </td>
                <td className='text-nowrap p-2 border border-border'>
                  {project.release_name || (
                    <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />
                  )}
                </td>
                <td className='text-nowrap p-2 border border-border'>
                  {project.contributors.length ? (
                    project.contributors.map((c) => c.artist_name).join(', ')
                  ) : (
                    <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />
                  )}
                </td>
                <td className='text-nowrap p-2 border border-border max-w-128 truncate'>
                  {project.notes || (
                    <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />
                  )}
                </td>
                <td className='text-nowrap p-2 border border-border'>
                  {project.date_created ? (
                    formatReadableDate(project.date_created)
                  ) : (
                    <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {count ? (
        <div className='flex items-center gap-4 bg-background-mid py-4 px-4'>
          <button
            className='p-1 rounded-md border border-text-muted/35 hover:not-disabled:border-text-muted/60 duration-300 cursor-pointer disabled:cursor-default disabled:opacity-50'
            disabled={page < 1}
            onClick={handlePageDecrement}>
            <ArrowLeft size={16} strokeWidth={2} className='text-text-muted/80' />
          </button>
          <p className='text-text-muted text-sm'>
            Page {page + 1} of {Math.ceil(count / PAGE_SIZE)}
          </p>
          <button
            className='p-1 rounded-md border border-text-muted/35 hover:not-disabled:border-text-muted/60 duration-300 cursor-pointer disabled:cursor-default disabled:opacity-50'
            disabled={!hasMore}
            onClick={handlePageIncrement}>
            <ArrowRight size={16} strokeWidth={2} className='text-text-muted/80' />
          </button>
          <p className='ml-4 text-text-muted font-bold text-sm'>{count} projects</p>
        </div>
      ) : null}
    </>
  );
}
