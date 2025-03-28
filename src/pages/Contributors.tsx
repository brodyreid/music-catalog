import ErrorMessage from '@/components/ErrorMessage.tsx';
import LoadingBars from '@/components/LoadingBars.tsx';
import Modal from '@/components/Modal.tsx';
import {
  useCreateContributor,
  useDeleteContributor,
  useGetContributors,
  useUpdateContributor,
} from '@/hooks/useContributors.ts';
import { Contributor } from '@/types.ts';
import { Minus, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export type ContributorFormData = Omit<Contributor, 'id'>;

export default function Contributors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    formState: { errors: formErrors },
    register,
    handleSubmit,
    reset,
  } = useForm<ContributorFormData>();
  const { data: contributors = [], isLoading, error } = useGetContributors();
  const { createContributor, isCreating } = useCreateContributor();
  const { updateContributor, isUpdating } = useUpdateContributor();
  const { deleteContributor, isDeleting } = useDeleteContributor();
  const isMutating = isCreating || isUpdating || isDeleting;

  const closeModal = () => {
    reset({
      artist_name: '',
      first_name: null,
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (contributor: Contributor) => {
    reset({
      artist_name: contributor.artist_name,
      first_name: contributor.first_name,
    });
    setEditingId(contributor.id);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: ContributorFormData) => {
    if (editingId) {
      updateContributor({ id: editingId, data: formData });
    } else {
      createContributor(formData);
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (!editingId) {
      throw Error('Contributor ID cannot be null');
    }
    if (!window.confirm('Are you sure you want to delete this contributor?')) {
      return;
    }

    deleteContributor(editingId);
    closeModal();
  };

  if (isLoading) return <LoadingBars />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      {/* Form modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} isMutating={isMutating}>
        <form onSubmit={handleSubmit(handleSave)} className='w-128'>
          <div className='flex justify-between items-center'>
            <label>Artist Name</label>
            <input
              {...register('artist_name', {
                required: 'A contributor needs an Artist Name',
              })}
              className='input-field'
            />
          </div>
          {formErrors.artist_name && (
            <p className='text-red-700'>{formErrors.artist_name.message}</p>
          )}
          <div className='flex justify-between items-center mt-8'>
            <label>First Name</label>
            <input {...register('first_name')} className='input-field' />
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
          <p>New Contributor</p>
        </button>
      </div>

      {/* Table */}
      <div className='overflow-auto max-h-screen'>
        <table className='text-sm table-auto border-collapse border-spacing-0'>
          <thead>
            <tr className='text-left bg-background-mid'>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-l-0 border-border'></th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                Artist Name
              </th>
              <th className='p-2 font-bold text-nowrap border border-t-0 border-border'>
                First Name
              </th>
            </tr>
          </thead>
          <tbody>
            {contributors.map((contributor) => (
              <tr key={contributor.id}>
                <td
                  className='text-nowrap p-2 border border-l-0 border-border hover hover:bg-background-mid'
                  onClick={() => handleEdit(contributor)}>
                  <Pencil size={12} strokeWidth={1.25} />
                </td>
                <td className='text-nowrap p-2 border border-border'>
                  {contributor.artist_name || (
                    <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />
                  )}
                </td>
                <td className='text-nowrap p-2 border border-border'>
                  {contributor.first_name || (
                    <Minus strokeWidth={1.25} size={16} className='text-text-muted/75' />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
