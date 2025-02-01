import { CatalogEntry } from '@/types.ts';
import { formatReadableDate } from '@/utils.ts';
import { useEffect, useState } from 'react';
import useFetchData from './useFetchData.tsx';

export const usePagination = (url: string, currentSearchTerm?: string) => {
  const { data: catalog, loading, error, refetch } = useFetchData<CatalogEntry>(url);
  const [currentData, setCurrentData] = useState<CatalogEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const postsPerPage = 50;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const PaginationNumbers = () => {
    return (
      <div className='flex justify-center mt-16'>
        {currentPage > 2 && (
          <>
            <button onClick={() => handlePageChange(1)} className='px-2 hover'>
              1
            </button>
            <p>...</p>
          </>
        )}
        {currentPage > 1 && (
          <>
            <button onClick={() => handlePageChange(currentPage - 1)} className='px-2 hover'>
              {currentPage - 1}
            </button>
          </>
        )}
        <p className='underline underline-offset-4 px-2'>{currentPage}</p>
        {currentPage < numberOfPages && (
          <>
            <button onClick={() => handlePageChange(currentPage + 1)} className='px-2 hover'>
              {currentPage + 1}
            </button>
            {currentPage < numberOfPages - 2 && (
              <>
                <p>...</p>
                <button onClick={() => handlePageChange(numberOfPages)} className='px-2 hover'>
                  {numberOfPages}
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const searchCatalog = (catalog: CatalogEntry[]) => {
    const cleanCatalog: CatalogEntry[] = catalog.map(({ project: { title, ...projectRest }, versions, ...rest }) => ({
      project: {
        title: title.replace('Project', '').trim(),
        ...projectRest,
      },
      versions: versions,
      ...rest,
    }));

    if (!currentSearchTerm) {
      return cleanCatalog;
    }

    const wordsToSearch: string[] = currentSearchTerm
      ? currentSearchTerm
          .toLowerCase()
          .split(' ')
          .filter((word) => word.trim() !== '')
      : [];

    return cleanCatalog.filter((entry) =>
      wordsToSearch.every(
        (word) =>
          entry.project.title.toLowerCase().includes(word) ||
          entry.project.folder_path.toLowerCase().includes(word) ||
          entry.project.notes?.toLowerCase().includes(word) ||
          entry.project.release_name?.toLowerCase().includes(word) ||
          entry.contributors
            ?.map((c) => [c.first_name, c.artist_name])
            .join(' ')
            .toLowerCase()
            .includes(word) ||
          entry.versions
            ?.map((v) => v.name)
            .join(' ')
            .toLowerCase()
            .includes(word) ||
          (entry.project.date_created && formatReadableDate(entry.project.date_created).toLowerCase().includes(word)),
      ),
    );
  };

  useEffect(() => {
    if (!catalog.length) {
      return;
    }

    const searchedCatalog = searchCatalog(catalog);

    setNumberOfPages(Math.ceil(searchedCatalog.length / postsPerPage));

    const startIndex = postsPerPage * (currentPage - 1);
    const stopIndex = startIndex + postsPerPage;

    setCurrentData(searchedCatalog.slice(startIndex, stopIndex));
  }, [catalog, currentPage, currentSearchTerm]);

  return { currentData, handlePageChange, loading, error, refetch, PaginationNumbers, setCurrentPage };
};
