import { useEffect, useRef, useState } from 'react';
import { ProjectFull, SortOptions } from '../types.ts';
import { formatDate } from '../utils.ts';

export default function ProjectsWithContributorsTable({ projects, sortDirection, onSort }: { projects: ProjectFull[]; sortDirection: SortOptions; onSort: (direction: SortOptions) => void; }) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState<{ show: boolean; rowId: number | null; }>({
    show: false,
    rowId: null
  });

  const handleButtonClick = (rowId: number) => {
    setShowTooltip({ show: true, rowId });
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : (sortDirection === 'desc' ? null : 'asc');

    onSort(newDirection);
  };

  const pageClick = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setShowTooltip({ show: false, rowId: null });
    }
  };

  useEffect(() => {
    if (showTooltip.show) {
      document.addEventListener('mousedown', pageClick);
    }

    return () => {
      document.removeEventListener('mousedown', pageClick);
    };
  }, [showTooltip]);

  return (
    <div className="mt-16">
      <table className="font-mono font-extralight text-sm border-separate border-spacing-2">
        <thead>
          <tr className='text-left border-b'>
            <th className='pr-3'>id</th>
            <th className='pr-3'>title</th>
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
          {projects.map(({ id, title, folder_path, notes, date_created, contributors, versions }) => (
            <tr key={id} className='relative'>
              <td className='text-nowrap pr-3'>{id}</td>
              <td className='text-nowrap pr-3 truncate max-w-52'>
                {
                  <>
                    {notes &&
                      <>
                        <div className='inline-block'>
                          <button type='button' className='mr-2 font-bold text-tertiary' onClick={() => handleButtonClick(id)}>i</button>
                        </div>
                        {(showTooltip.show && showTooltip.rowId === id) &&
                          <div ref={tooltipRef} className='absolute top-full bg-stone-300 p-2 max-w-80 whitespace-normal rounded-md text-secondary font-normal z-20'>{notes}</div>
                        }
                      </>
                    }
                    <span>{title}</span>
                  </>
                }
              </td>
              <td className='text-nowrap pr-3'>{versions.join(', ')}</td>
              <td className='text-nowrap pr-3'>{folder_path && folder_path.replace(/^.*\/projects\//i, '/')}</td>
              <td className='text-nowrap pr-3'>{contributors.join(', ')}</td>
              <td className="text-nowrap">{formatDate(date_created)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}