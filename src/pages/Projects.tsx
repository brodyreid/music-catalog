import { deleteProject, updateProject } from '@/api/projectQueries.ts';
import LoadingBars from '@/components/LoadingBars.tsx';
import Modal from '@/components/Modal.tsx';
import { useGetProjects } from '@/hooks/useProjects.ts';
import { Project } from '@/types/index.ts';
import { formatReadableDate, MUSICAL_KEYS } from '@/utils.ts';
import { ChevronDown, Minus, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = Pick<Project, 'title' | 'release_name' | 'bpm' | 'musical_key' | 'notes' | 'date_created'>;

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const { data: projects = [], isLoading, error } = useGetProjects();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<FormData>();
  const isMutating = false;

  const closeModal = () => {
    reset({
      title: '',
      release_name: null,
      bpm: null,
      musical_key: null,
      notes: null,
      date_created: null,
    });
    setSelected(null);
    setIsModalOpen(false);
  };

  const handleEdit = (project: Project) => {
    reset({
      title: project.title,
      release_name: project.release_name,
      bpm: project.bpm,
      musical_key: project.musical_key,
      notes: project.notes,
      date_created: project.date_created,
    });
    setSelected(project);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: FormData) => {
    if (selected) {
      updateProject({ id: selected.id, data: formData });
    } else {
      // need to hash the folder_path for folder_path_hash col as it is required
      // createProject(formData);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!selected) {
      throw Error('No project selected');
    }
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    deleteProject(selected.id);
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
          <div className='flex justify-between items-center mt-8'>
            <label>Release Name</label>
            <input {...register('release_name')} className='input-field' />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>BPM</label>
            <input {...register('bpm')} type='number' min='0' className='input-field' />
          </div>
          <div className='relative flex justify-between items-center mt-8'>
            <label>Key</label>
            <select {...register('musical_key')} className='input-field appearance-none'>
              <option value=''></option>
              {MUSICAL_KEYS.map((key) => (
                <option key={key} value='key'>
                  {key}
                </option>
              ))}
            </select>
            <ChevronDown strokeWidth={1.5} className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' size={20} />
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
            {selected && (
              <button type='button' className='text-sm bg-red-700/75 px-2.5 py-1 rounded-md border border-red-500/50 hover' onClick={handleDelete}>
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
      <div className='h-16 flex items-center px-4 border-b border-border'>
        <button type='button' onClick={() => setIsModalOpen(true)} className='text-sm bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover flex items-center gap-1.5 justify-center'>
          <Plus size={16} strokeWidth={1.25} />
          <p>New Project</p>
        </button>
      </div>

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
