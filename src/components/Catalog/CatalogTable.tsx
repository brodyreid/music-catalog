import { ProjectActions, ProjectState } from '@/reducers/projectReducer.ts';
import { CatalogEntry, SortOptions } from '@/types/index.ts';
import { formatReadableDate } from '@/utils.ts';
import { Dispatch, useEffect, useRef, useState } from 'react';

interface CatalogTableProps {
  catalog: CatalogEntry[];
  state: ProjectState;
  dispatch: Dispatch<ProjectActions>;
  sortDirection: SortOptions;
  onSort: (direction: SortOptions) => void;
}

export default function CatalogTable({ catalog, state, dispatch, sortDirection, onSort }: CatalogTableProps) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState<{ show: boolean; rowId: string | null }>({
    show: false,
    rowId: null,
  });

  const handleNotesButtonClick = (rowId: string) => {
    setShowTooltip({ show: true, rowId });
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc';
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

  console.log(state.current)

  return (
    <table className='font-mono font-extralight text-sm border-separate border-spacing-2 mb-12'>
      <thead>
        <tr className='text-left border-b'>
          <th className='pr-3'>title</th>
          <th className='pr-3'>release_name</th>
          <th className='pr-3'>versions</th>
          <th className='pr-3'>track_notation</th>
          <th className='pr-3'>folder_path</th>
          <th className='pr-3'>contributors</th>
          <th>
            <button type='button' onClick={handleSort}>
              <span>date_created</span>
              <span>{sortDirection === 'asc' ? '\u25B4' : sortDirection === 'desc' ? '\u25BE' : ''}</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {catalog.map((entry) => {
          const { contributors, versions } = entry;
          const { id, title, release_name, folder_path, notes, date_created, bpm, musical_key } = entry.project;
          const path = folder_path && folder_path.replace(/^.*\/projects\//i, '/');

          return (
            <tr key={id} className={`relative ${state.current?.id === id && 'font-bold text-orange-300'}`}>
              <td className='text-nowrap pr-3 truncate max-w-60'>
                {
                  <>
                    {notes && (
                      <>
                        <div className='inline-block'>
                          <button type='button' className='mr-2 font-bold text-tertiary hover' onClick={() => handleNotesButtonClick(id)}>
                            i
                          </button>
                        </div>
                        {showTooltip.show && showTooltip.rowId === id && (
                          <div ref={tooltipRef} className='absolute top-full bg-stone-300 p-2 max-w-80 whitespace-pre-wrap rounded-md text-secondary font-normal z-20'>
                            {notes}
                          </div>
                        )}
                      </>
                    )}
                    <button type='button' onClick={() => dispatch({ type: 'set_current', current: { ...entry.project, contributors: entry.contributors || [] } })} className='cursor-pointer hover'>
                      {title}
                    </button>
                  </>
                }
              </td>
              <td className='text-nowrap pr-3'>{release_name}</td>
              <td className='text-nowrap pr-3'>{versions?.length ?? ''}</td>
              <td className='text-nowrap pr-3'>
                {bpm && bpm + ' bpm'}
                {musical_key && ', ' + musical_key}
              </td>
              <td className='text-nowrap pr-3'>{path}</td>
              <td className='text-nowrap pr-3'>{contributors?.map((c) => [c.first_name]).join(', ')}</td>
              <td className='text-nowrap'>{date_created ? formatReadableDate(date_created) : ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
