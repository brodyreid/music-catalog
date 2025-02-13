import LoadingBars from '@/components/LoadingBars.tsx';
import Modal from '@/components/Modal.tsx';
import ProjectSelector from '@/components/ProjectSelector.tsx';
import {
  useCreateAlbum,
  useDeleteAlbum,
  useGetAlbums,
  useUpdateAlbum,
} from '@/hooks/useAlbums.ts';
import { AlbumWithProjects } from '@/types/index.ts';
import { formatReadableDate } from '@/utils.ts';
import { ChevronDown, ChevronRight, Minus, Pencil, Plus } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export type AlbumFormData = Omit<AlbumWithProjects, 'id'>;

export default function Albums() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const {
    formState: { errors: formErrors },
    register,
    handleSubmit,
    reset,
    control,
  } = useForm<AlbumFormData>();
  const { data: albums = [], isLoading, error } = useGetAlbums();
  const { createAlbum, isCreating } = useCreateAlbum();
  const { updateAlbum, isUpdating } = useUpdateAlbum();
  const { deleteAlbum, isDeleting } = useDeleteAlbum();
  const isMutating = isCreating || isUpdating || isDeleting;

  const handleRowClick = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleEdit = (album: AlbumWithProjects) => {
    reset({
      title: album.title,
      notes: album.notes,
      release_date: album.release_date,
      projects: album.projects,
    });
    setEditingId(album.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    reset({
      title: '',
      notes: null,
      release_date: null,
      projects: [],
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSave = async (formData: AlbumFormData) => {
    if (editingId) {
      updateAlbum({ id: editingId, data: formData });
    } else {
      createAlbum(formData);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!editingId) {
      throw Error('Album ID cannot be null');
    }
    if (!window.confirm('Are you sure you want to delete this album?')) {
      return;
    }

    deleteAlbum(editingId);
    closeModal();
  };

  if (isLoading || isMutating) return <LoadingBars />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {/* Form modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} isMutating={isMutating}>
        <form onSubmit={handleSubmit(handleSave)} className='w-128'>
          <div className='flex justify-between items-center'>
            <label>Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className='input-field'
            />
          </div>
          {formErrors.title && <p className='text-red-700'>{formErrors.title.message}</p>}
          <div className='flex justify-between mt-8'>
            <label>Notes</label>
            <textarea {...register('notes')} rows={4} className='input-field' />
          </div>
          <div className='flex justify-between mt-8'>
            <label>Projects</label>
            <Controller
              name='projects'
              control={control}
              defaultValue={[]}
              render={({ field }) => <ProjectSelector {...field} />}
            />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>Release Date</label>
            <input
              {...register('release_date')}
              type='date'
              className='input-field dark:text-white dark:[color-scheme:dark]'
            />
          </div>
          <div className='flex mt-8 pt-4 border-t border-border'>
            {editingId && (
              <button
                type='button'
                disabled={isMutating}
                className='text-sm bg-red-700/75 px-2.5 py-1 rounded-md border border-red-500/50 hover'
                onClick={handleDelete}>
                Delete
              </button>
            )}
            <div className='flex items-center gap-4 ml-auto'>
              <button
                type='button'
                disabled={isMutating}
                className='text-sm bg-gray-700/75 px-2.5 py-1 rounded-md border border-gray-500/50 hover'
                onClick={closeModal}>
                Cancel
              </button>
              <button
                type='submit'
                disabled={isMutating}
                className='text-sm bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover'>
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Topbar */}
      <div className='h-16 flex items-center px-4 border-b border-border'>
        <button
          type='button'
          onClick={() => setIsModalOpen(true)}
          className='text-sm bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover flex items-center gap-1.5 justify-center'>
          <Plus size={16} strokeWidth={1.25} />
          <p>New Album</p>
        </button>
      </div>

      {/* Table */}
      <div className='overflow-auto max-h-screen'>
        <table className='text-sm table-auto border-collapse border-spacing-0'>
          <thead>
            <tr className='text-left bg-background-mid'>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-l-0 border-border'></th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Title
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Notes
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Release Date
              </th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => {
              const isExpanded = expandedRows.includes(album.id.toString());
              const hasProjects = !!album.projects.length;

              return (
                <Fragment key={album.id}>
                  <tr key={album.id}>
                    <td
                      className='text-nowrap p-2 border border-l-0 border-border hover hover:bg-background-mid'
                      onClick={() => handleEdit(album)}>
                      <Pencil size={12} strokeWidth={1.25} />
                    </td>
                    <td
                      className={`text-nowrap p-2 border border-border ${hasProjects && 'hover hover:bg-background-mid'}`}
                      onClick={
                        hasProjects
                          ? () => handleRowClick(album.id.toString())
                          : undefined
                      }>
                      <p className='flex items-center gap-1.5'>
                        {hasProjects &&
                          (isExpanded ? (
                            <ChevronDown size={14} strokeWidth={1.25} />
                          ) : (
                            <ChevronRight size={14} strokeWidth={1.25} />
                          ))}{' '}
                        {album.title}
                      </p>
                    </td>
                    <td className='text-nowrap p-2 border border-border max-w-128 truncate'>
                      {album.notes || (
                        <Minus
                          strokeWidth={1.25}
                          size={16}
                          className='text-text-muted/75'
                        />
                      )}
                    </td>
                    <td className='text-nowrap p-2 border border-border'>
                      {album.release_date ? (
                        formatReadableDate(album.release_date)
                      ) : (
                        <Minus
                          strokeWidth={1.25}
                          size={16}
                          className='text-text-muted/75'
                        />
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td className='border-b border-border'></td>
                      <td colSpan={3} className='border-r border-b border-border'>
                        <ol>
                          {album.projects.map((project) => (
                            <li key={project.id} className='p-2 list-inside list-decimal'>
                              {project.release_name || project.title}
                            </li>
                          ))}
                        </ol>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
