import { useGetProjects } from '@/hooks/useProjects.ts';
import { Project, ProjectWithAll } from '@/types/index.ts';
import { Dot, LoaderCircle, Search } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import ErrorMessage from './ErrorMessage.tsx';
import { Skeleton } from './Skeleton.tsx';

type ProjectSelectorProps = ControllerRenderProps;

const ProjectSelector = forwardRef<HTMLDivElement, ProjectSelectorProps>(
  ({ value, onChange, ...rest }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [debouncedSearchTerm, { isPending }] = useDebounce(searchTerm, 500);
    const [isAddProjectsOpen, setIsAddProjectsOpen] = useState(false);
    const {
      data: { projects: eligibleProjects } = {
        projects: [],
      },
      isLoading,
      error,
    } = useGetProjects({ page: 0, searchTerm: debouncedSearchTerm });

    const selectedProjects = value as Project[];

    useEffect(() => {
      setIsSearching(isPending());
    }, [searchTerm, debouncedSearchTerm]);

    const handleClick = (project: ProjectWithAll) => {
      const { contributors, album, ...rest } = project;
      const newProject = rest as Project;
      setIsAddProjectsOpen(false);
      onChange([...selectedProjects, newProject]);
    };

    if (isLoading) return <Skeleton />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
      <div ref={ref} className='relative' {...rest}>
        <button
          type='button'
          onClick={() => setIsAddProjectsOpen((prev) => !prev)}
          className='px-3 py-1 bg-border/25 border border-border rounded-sm cursor-pointer hover:border-text-muted/30 text-text-muted/60 hover:text-text-muted/90 duration-300 mb-3'>
          Add project...
        </button>
        {isAddProjectsOpen && (
          <div className='absolute rounded-md border border-border right-1/2 mr-1 mt-2 bg-background-mid'>
            <div className='border-b w-full ring-border  outline-none py-3 pl-1.5 border-border flex items-center gap-1'>
              <span>
                {isSearching ? (
                  <LoaderCircle
                    className='text-text-muted/75 animate-spin'
                    strokeWidth={2}
                    width={16}
                    height={16}
                  />
                ) : (
                  <Search
                    className='text-text-muted/50'
                    strokeWidth={1.25}
                    width={16}
                    height={16}
                  />
                )}
              </span>
              <input
                type='text'
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder='Search projects...'
                className='text-sm focus:ring-0 focus:outline-none w-full'
              />
            </div>
            <div className='overflow-auto w-88 h-88'>
              <ul className='my-4'>
                {eligibleProjects.map((project) => (
                  <li
                    key={project.id}
                    className='px-4 py-2.5 hover:bg-border/70 duration-300 cursor-pointer'
                    onClick={() => handleClick(project)}>
                    <p>{project.title}</p>
                    {project.release_name && (
                      <p className='text-sm text-text-muted/80'>{project.release_name}</p>
                    )}
                    {!!project.contributors.length && (
                      <span>
                        <Dot size={16} className='inline' />
                        {project.contributors.map((c) => (
                          <span className='text-sm text-text-muted/80'>
                            {c.artist_name}
                          </span>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <ol className='list-decimal list-inside space-y-1.5 w-64'>
          {selectedProjects.map((project) => (
            <li key={project.id}>{project.release_name || project.title}</li>
          ))}
        </ol>
      </div>
    );
  },
);

export default ProjectSelector;
