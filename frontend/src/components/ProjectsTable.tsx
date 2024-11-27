import { Dispatch, useEffect, useRef, useState } from 'react';
import { ProjectState } from '../reducers/projectReducer.ts';
import { Project, ProjectActions, SortOptions } from '../types.ts';
import { formatDate } from '../utils.ts';

interface ProjectsTableProps {
  projects: Project[];
  projectState: ProjectState;
  projectDispatch: Dispatch<ProjectActions>;
  sortDirection: SortOptions;
  onSort: (direction: SortOptions) => void;
}

export default function ProjectsTable({ projects, projectState, projectDispatch, sortDirection, onSort }: ProjectsTableProps) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState<{ show: boolean; rowId: string | null; }>({
    show: false,
    rowId: null
  });

  const handleNotesButtonClick = (rowId: string) => {
    setShowTooltip({ show: true, rowId });
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : (sortDirection === 'desc' ? null : 'asc');
    onSort(newDirection);
  };

  const handlePageClick = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setShowTooltip({ show: false, rowId: null });
    }
  };

  useEffect(() => {
    if (showTooltip.show) {
      document.addEventListener('mousedown', handlePageClick);
    }
    return () => {
      document.removeEventListener('mousedown', handlePageClick);
    };
  }, [showTooltip]);

  return (
    <div className="mt-16">
      <table className="font-mono font-extralight text-sm border-separate border-spacing-2">
        <thead>
          <tr className='text-left border-b'>
            <th className='pr-3'>title</th>
            <th className='pr-3'>release_name</th>
            <th className='pr-3'>versions</th>
            <th className='pr-3'>folder_path</th>
            <th className='pr-3'>contributors</th>
            <th>
              <button type='button' onClick={handleSort}>
                <span>date_created</span>
                <span>{sortDirection === 'asc' ? '\u25B4' : (sortDirection === 'desc' ? '\u25BE' : '')}</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            const { id, title, release_name, folder_path, notes, date_created, contributors, versions } = project;
            const path = folder_path && folder_path.replace(/^.*\/projects\//i, '/');

            return (
              <tr key={id} className={`relative ${projectState.selectedProject?.id === id && 'font-bold text-orange-300'}`}>
                <td className='text-nowrap pr-3 truncate max-w-60'>
                  {
                    <>
                      {notes &&
                        <>
                          <div className='inline-block'>
                            <button type='button' className='mr-2 font-bold text-tertiary' onClick={() => handleNotesButtonClick(id)}>i</button>
                          </div>
                          {(showTooltip.show && showTooltip.rowId === id) &&
                            <div ref={tooltipRef} className='absolute top-full bg-stone-300 p-2 max-w-80 whitespace-normal rounded-md text-secondary font-normal z-20'>{notes}</div>
                          }
                        </>
                      }
                      <button type='button' onClick={() => projectDispatch({ type: 'set_selected_project', project })} className='cursor-pointer hover:brightness-75 duration-100'>{title}</button>
                    </>
                  }
                </td>
                <td className='text-nowrap pr-3'>{release_name}</td>
                <td className='text-nowrap pr-3'>{versions?.length ?? ''}</td>
                <td className='text-nowrap pr-3'>{path}</td>
                <td className='text-nowrap pr-3'>{contributors?.map(c => [c.artist_name]).join(', ')}</td>
                <td className="text-nowrap">{date_created ? formatDate(date_created) : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}