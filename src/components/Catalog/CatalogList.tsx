import Search from '@/components/shared/Search.tsx';
import useToast from '@/hooks/useToast.tsx';
import { initialState, projectReducer } from '@/reducers/projectReducer.ts';
import supabase from '@/supabase.ts';
import { CatalogEntry, MusicalKey, Project, SortOptions } from '@/types/index.ts';
import { saveData } from '@/utils.ts';
import { useEffect, useReducer, useState } from 'react';
import ProjectActions from '../Projects/ProjectActions.tsx';
import CatalogTable from './CatalogTable.tsx';

interface UpdateProjectBody {
  release_name: string | null;
  notes: string | null;
  bpm: number | null;
  musical_key: MusicalKey | null;
  contributor_ids: string[];
}

export default function CatalogList() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [filteredCatalog, setFilteredCatalog] = useState<CatalogEntry[]>([]);
  const [sortDirection, setSortDirection] = useState<SortOptions>('desc');
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [catalog, setCatalog] = useState<any[]>([]);
  // const { currentData: catalog, loading, error: fetchError, refetch, PaginationNumbers, setCurrentPage } = usePagination('http://localhost:3000/projects', currentSearchTerm);

  useEffect(() => {
    const getCatalog = async () => {
      const { data: entries, error } = await supabase.from('projects').select(`
        *,
        contributors ( * ),
        versions ( * ),
        albums ( * )
        `);
      if (error) {
        throw new Error(error.message);
      }
      setCatalog(
        entries?.map(({ id, contributors, versions, albums, ...rest }) => ({
          id,
          project: {
            id,
            ...rest,
          },
          contributors,
          versions,
          albums,
        })),
      );
    };

    getCatalog();
  }, []);

  const sortByDate = (direction: SortOptions) => {
    const newData = catalog.toSorted((a, b) => {
      if (!a.project.date_created || !b.project.date_created) {
        return 0;
      }

      if (direction === 'asc') {
        return a.project.date_created < b.project.date_created ? -1 : a.project.date_created > b.project.date_created ? 1 : 0;
      }
      if (direction === 'desc') {
        return a.project.date_created < b.project.date_created ? 1 : a.project.date_created > b.project.date_created ? -1 : 0;
      }

      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

    setSortDirection(direction);
    setFilteredCatalog(newData);
  };

  const resetCatalogList = () => {
    setCurrentSearchTerm('');
    // refetch();
  };

  const handleSearch = (term: string) => {
    setCurrentSearchTerm(term);
    // setCurrentPage(1);
  };

  const handleUpdateProject = async () => {
    if (!state.current) {
      console.error('No project to update.');
      return;
    }

    try {
      const response = await saveData<UpdateProjectBody, Project>(`http://localhost:3000/projects/${state.current.id}`, {
        release_name: state.release_name,
        notes: state.notes,
        bpm: state.bpm,
        musical_key: state.musical_key,
        contributor_ids: state.contributors?.map((c) => c.id) ?? [],
      });

      setFilteredCatalog((prev) =>
        prev.map((prevEntry) => {
          if (prevEntry.id === response.data.id) {
            return {
              ...prevEntry,
              project: response.data,
            };
          }
          return prevEntry;
        }),
      );
      showToast(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setFilteredCatalog(catalog);
  }, [catalog]);

  // if (fetchError) {
  //   console.error(fetchError);
  //   return (
  //     <>
  //       <div>Sorry gamer, there was an error!</div>
  //       <pre className='mt-8'>
  //         {fetchError.name}: {fetchError.message}
  //       </pre>
  //     </>
  //   );
  // }

  // if (loading) {
  //   return <div>Please wait, gamer! It's loading...</div>;
  // }

  return (
    <>
      <div className='flex items-start justify-between'>
        <Search onSearch={handleSearch} onReset={resetCatalogList} currentSearchTerm={currentSearchTerm} />
        <ProjectActions state={state} dispatch={dispatch} onUpdate={handleUpdateProject} />
      </div>
      {filteredCatalog?.length && (
        <>
          {/* <PaginationNumbers /> */}
          <CatalogTable catalog={filteredCatalog} state={state} dispatch={dispatch} sortDirection={sortDirection} onSort={sortByDate} />
        </>
      )}
    </>
  );
}
