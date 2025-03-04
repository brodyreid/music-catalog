import { PAGE_SIZE } from '@/api/projectQueries.ts';
import ErrorMessage from '@/components/ErrorMessage.tsx';
import LoadingBars from '@/components/LoadingBars.tsx';
import Modal from '@/components/Modal.tsx';
import Select from '@/components/Select.tsx';
import { useGetContributors } from '@/hooks/useContributors.ts';
import {
  useDeleteProject,
  useGetProjects,
  useUpdateProject,
} from '@/hooks/useProjects.ts';
import { ProjectWithAll } from '@/types.ts';
import { convertEmptyStringsToNull, formatReadableDate, MUSICAL_KEYS } from '@/utils.ts';
import { confirm, open } from '@tauri-apps/plugin-dialog';
import { ArrowLeft, ArrowRight, ChevronDown, Minus, Pencil, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

export type ProjectFormData = Omit<ProjectWithAll, 'id' | 'folder_path_hash' | 'album'>;

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<ProjectWithAll | null>(null);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm, { isPending }] = useDebounce(searchTerm, 500);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    control,
  } = useForm<ProjectFormData>();
  const {
    data: { projects, count, hasMore } = {
      projects: [],
      count: 0,
      hasMore: false,
    },
    isLoading,
    error,
  } = useGetProjects({ page, searchTerm: debouncedSearchTerm });
  const { data: contributors = [] } = useGetContributors();
  const { updateProject, isUpdating } = useUpdateProject();
  const { deleteProject, isDeleting } = useDeleteProject();
  const isMutating = isUpdating || isDeleting;

  useEffect(() => {
    setIsSearching(isPending());
  }, [searchTerm, debouncedSearchTerm]);

  const closeModal = () => {
    reset({
      title: '',
      release_name: null,
      path: null,
      bpm: null,
      musical_key: null,
      notes: null,
      date_created: null,
    });
    setSelected(null);
    setIsModalOpen(false);
  };

  const handleEdit = (project: ProjectWithAll) => {
    reset({
      title: project.title,
      release_name: project.release_name,
      path: project.path,
      bpm: project.bpm,
      musical_key: project.musical_key,
      notes: project.notes,
      date_created: project.date_created,
      contributors: project.contributors,
    });
    setSelected(project);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: ProjectFormData) => {
    if (selected) {
      const formDataCleaned = convertEmptyStringsToNull(formData);

      updateProject({
        id: selected.id,
        data: formDataCleaned,
      });
    }

    closeModal();
  };

  const handleDelete = async () => {
    if (!selected) {
      throw Error('No project selected');
    }

    const confirmed = await confirm(
      `Are you sure you want to delete ${selected.title}?`,
      {
        title: 'Delete Project',
        kind: 'warning',
        okLabel: 'Delete',
        cancelLabel: 'Cancel',
      },
    );

    if (!confirmed) {
      return;
    }

    deleteProject(selected.id);
    closeModal();
  };

  const chooseDirectory = async () => {
    try {
      const dir = await open({
        multiple: false,
        directory: true,
      });

      console.log(dir);
    } catch (error) {
      console.error(error);
    }
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
      {/* Form modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} isMutating={isMutating}>
        <form onSubmit={handleSubmit(handleSave)} className='w-164'>
          <div className='flex justify-between items-center'>
            <label>Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className='input-field w-88'
            />
          </div>
          {formErrors.title && <p className='text-red-700'>{formErrors.title.message}</p>}
          <div className='flex justify-between items-center mt-8'>
            <label>Release Name</label>
            <input {...register('release_name')} className='input-field w-88' />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>Folder Path</label>
            <input {...register('path')} className='input-field w-88' />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>BPM</label>
            <input
              {...register('bpm')}
              type='number'
              min='0'
              className='input-field w-22'
            />
          </div>
          <div className='relative flex justify-between items-center mt-8'>
            <label>Key</label>
            <select
              {...register('musical_key')}
              className='input-field w-32 appearance-none'>
              <option value=''></option>
              {MUSICAL_KEYS.map((key) => (
                <option key={key} value='key'>
                  {key}
                </option>
              ))}
            </select>
            <ChevronDown
              strokeWidth={1.5}
              className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
              size={20}
            />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>Contributors</label>
            <Controller
              name='contributors'
              control={control}
              render={({ field }) => <Select {...field} contributors={contributors} />}
            />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>Date Created</label>
            <input
              {...register('date_created')}
              type='date'
              className='input-field w-44 dark:text-white dark:[color-scheme:dark]'
            />
          </div>
          <div className='flex justify-between mt-8'>
            <label>Notes</label>
            <textarea {...register('notes')} rows={4} className='input-field w-88' />
          </div>
          <div className='flex mt-8 pt-4 border-t border-border'>
            {selected && (
              <button
                type='button'
                className='text-sm bg-red-700/75 px-2.5 py-1 rounded-md border border-red-500/50 hover'
                onClick={handleDelete}>
                Delete
              </button>
            )}
            <div className='flex items-center gap-4 ml-auto'>
              <button
                type='button'
                className='text-sm bg-gray-700/75 px-2.5 py-1 rounded-md border border-gray-500/50 hover'
                onClick={closeModal}>
                Cancel
              </button>
              <button
                type='submit'
                className='text-sm bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover'>
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Topbar */}
      <div className='py-4 flex items-center px-4 border-b border-border'>
        <button
          type='button'
          className='px-2.5 py-1.5 border border-zinc-400 rounded hover text-sm'
          onClick={chooseDirectory}>
          Choose Directory
        </button>
        <div className='ml-auto'>
          <div className='border ring-border has-focus:ring-2 has-focus-visible:ring-text-muted/30 has-focus-visible:border-text/50 has-focus-visible:shadow-lg outline-none w-56 py-1.5 pl-1.5 border-border flex items-center gap-1 rounded-md bg-background-mid/65'>
            <span className='flex items-center justify-center w-5 h-5'>
              {isSearching ? (
                <span className='w-4 h-4 border-[1.5px] border-text-muted/20 border-t-text-muted/75 rounded-full animate-spin' />
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
                Path
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
            className='p-1 rounded-md border border-text-muted/35 hover:not-disabled:border-text-muted/60 duration-300 cursor-pointer disabled:cursor-default disabled:opacity-30'
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
