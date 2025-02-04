import Modal from '@/components/Modal.tsx';
import { albumReducer, initialState } from '@/reducers/albumReducer.ts';
import supabase from '@/supabase.ts';
import { formatReadableDate } from '@/utils.ts';
import { ChevronDown } from 'lucide-react';
import { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Albums() {
  const [state, dispatch] = useReducer(albumReducer, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm();
  const { all: data, current } = state;

  useEffect(() => {
    const getAlbums = async () => {
      const { data, error } = await supabase.from('albums').select(`
        *,
        projects ( * )
        `);
      if (error) {
        throw error;
      }

      dispatch({ type: 'set_all', all: data });
    };

    getAlbums();
  }, []);

  const createAlbum = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      {/* Modal */}
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit(createAlbum)} className='w-96'>
          <div className='flex justify-between items-center'>
            <label>Title</label>
            <input {...register('title', { required: true })} className='input-field' />
          </div>
          <div className='flex justify-between mt-8'>
            <label>Notes</label>
            <textarea {...register('notes')} rows={4} className='input-field' />
          </div>
         <div className='flex justify-end gap-4 mt-8 pt-4 border-t border-border'>
            <button type='button' className='btn-gray'>Cancel</button>
            <button type='submit' className='btn-green'>Save</button>
         </div>
        </form>
      </Modal>

      {/* Topbar */}
      <div className='h-16 flex items-center px-4 border-b border-border'>
        <button type='button' onClick={() => setIsModalOpen(true)} className='btn-green'>
          <ChevronDown size={16} strokeWidth={1.25} />
          <p>New Album</p>
        </button>
      </div>
      <table className='text-sm border-separate border-spacing-2'>
        <thead>
          <tr className='text-left *:font-bold'>
            <th className='pr-4 font-normal'>title</th>
            <th className='pr-4 font-normal'>notes</th>
            <th className='pr-4 font-normal'>release_date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((album) => {
            const { id, title, notes, release_date } = album;

            return (
              <tr key={id} className={`relative cursor-pointer hover ${current?.id === id && 'font-bold text-orange-300'}`} onClick={() => dispatch({ type: 'set_current', current: album })}>
                <td className='text-nowrap pr-3'>{title}</td>
                <td className='text-nowrap pr-3'>{notes}</td>
                <td className='text-nowrap pr-3'>{release_date && formatReadableDate(release_date)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
