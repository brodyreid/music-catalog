import LoadingBars from '@/components/LoadingBars.tsx';
import Modal from '@/components/Modal.tsx';
import { useGetProjects } from '@/hooks/useProjects.ts';
import { Project, ProjectWithAll } from '@/types/index.ts';
import { formatReadableDate } from '@/utils.ts';
import { Minus, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = Partial<Omit<Project, 'id'>>;

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data: projects = [], isLoading, error } = useGetProjects();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<FormData>();
  const isMutating = false;

  const closeModal = () => {
    reset();
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (project: ProjectWithAll) => {
    reset({});
    setEditingId(project.id);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: FormData) => {
    if (editingId) {
      updateProject({ id: editingId, data: formData });
    } else {
      createProject(formData);
    }
    closeModal();
  };

  if (isLoading) return <LoadingBars />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {/* Form modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} isMutating={isMutating}>
        <form onSubmit={handleSubmit(handleSave)} className='w-128'>
          <div className='flex justify-between items-center'>
            <label>Title</label>
            <input {...register('title', { required: 'Title is required' })} className='input-field' />
          </div>
          {formErrors.title && <p className='text-red-700'>{formErrors.title.message}</p>}
          <div className='flex justify-between mt-8'>
            <label>Notes</label>
            <textarea {...register('notes')} rows={4} className='input-field' />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>Date Created</label>
            <input {...register('date_created')} type='date' className='input-field dark:text-white dark:[color-scheme:dark]' />
          </div>
          <div className='flex mt-8 pt-4 border-t border-border'>
            {editingId && (
              <button type='button' className='text-sm bg-red-700/75 px-2.5 py-1 rounded-md border border-red-500/50 hover'>
                Delete
              </button>
            )}
            <div className='flex items-center gap-4 ml-auto'>
              <button type='button' className='text-sm bg-gray-700/75 px-2.5 py-1 rounded-md border border-gray-500/50 hover' onClick={closeModal}>
                Cancel
              </button>
              <button type='submit' className='text-sm bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover'>
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Topbar */}
      {/* <div className='h-16 flex items-center px-4 border-b border-border'>
        <ProjectsScanner />
      </div> */}

      {/* Table */}
      <table className='w-full h-full text-sm table-auto border-collapse border-spacing-0'>
        <thead>
          <tr className='text-left bg-background-mid'>
            <th className='p-2 font-bold text-nowrap border border-t-0 border-l-0 border-border'></th>
            <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>Title</th>
            <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>Folder Path</th>
            <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>Release Name</th>
            <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>Notes</th>
            <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className='text-nowrap p-2 border border-l-0 border-border hover hover:bg-background-mid' onClick={() => handleEdit(project)}>
                <Pencil size={12} strokeWidth={1.25} />
              </td>
              <td className='text-nowrap p-2 border border-border'>{project.title}</td>
              <td className='text-nowrap p-2 border border-border'>{project.folder_path || <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />}</td>
              <td className='text-nowrap p-2 border border-border'>{project.release_name || <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />}</td>
              <td className='text-nowrap p-2 border border-border max-w-128 truncate'>{project.notes || <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />}</td>
              <td className='text-nowrap p-2 border border-border'>{project.date_created ? formatReadableDate(project.date_created) : <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
