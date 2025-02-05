import Modal from '@/components/Modal.tsx';
import supabase from '@/supabase.ts';
import { AlbumWithProjects } from '@/types/index.ts';
import { formatReadableDate, generateId } from '@/utils.ts';
import { ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  title: string;
  notes: string;
  release_date: string;
};

export default function Albums() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithProjects>();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [albums, setAlbums] = useState<AlbumWithProjects[]>([]);
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      title: selectedAlbum?.title ?? undefined,
      notes: selectedAlbum?.notes ?? undefined,
      release_date: selectedAlbum?.release_date ?? undefined,
    },
  });

  const handleRowClick = (id: string) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const handlePencilClick = (album: AlbumWithProjects) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAlbum(undefined);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getAlbums = async () => {
      const { data, error } = await supabase.from('albums').select(`
        *,
        projects ( * )
        `);

      if (error) {
        throw error;
      }

      setAlbums(data);
    };

    getAlbums();
  }, []);

  const createAlbum = async (formData: FormData) => {
    const { error } = await supabase
      .from('albums')
      .insert([{ id: generateId(), title: formData.title, notes: formData.notes, release_date: formData.release_date }])
      .select();

    setIsModalOpen(false);

    if (error) {
      throw error;
    }
  };

  console.log(expandedRows);

  return (
    <div>
      {/* Form modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <form onSubmit={handleSubmit(createAlbum)} className='w-128'>
          <div className='flex justify-between items-center'>
            <label>Title</label>
            <input {...register('title', { required: 'Title is required' })} className='input-field' />
          </div>
          {errors.title && <p className='text-red-700'>{errors.title.message}</p>}
          <div className='flex justify-between mt-8'>
            <label>Notes</label>
            <textarea {...register('notes')} rows={4} className='input-field' />
          </div>
          <div className='flex justify-between items-center mt-8'>
            <label>Release Date</label>
            <input {...register('release_date')} type='date' className='input-field dark:text-white dark:[color-scheme:dark]' />
          </div>
          <div className='flex justify-end gap-4 mt-8 pt-4 border-t border-border'>
            <button type='button' className='text-xs bg-gray-700/75 px-2.5 py-1 rounded-md border border-gray-500/50 hover flex items-center gap-2.5 justify-center' onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type='submit' className='text-xs bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover flex items-center gap-2.5 justify-center'>
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Topbar */}
      <div className='h-16 flex items-center px-4 border-b border-border'>
        <button type='button' onClick={() => setIsModalOpen(true)} className='text-xs bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover flex items-center gap-2.5 justify-center'>
          <ChevronDown size={16} strokeWidth={1.25} />
          <p>New Album</p>
        </button>
      </div>

      {/* Table */}
      <table className='text-sm table-auto border-collapse border-spacing-0'>
        <thead>
          <tr className='text-left bg-background-mid'>
            <th className='p-3 font-bold border border-t-0 border-l-0 border-border'></th>
            <th className='p-3 font-bold border border-t-0 border-border'>title</th>
            <th className='p-3 font-bold border border-t-0 border-border'>notes</th>
            <th className='p-3 font-bold border border-t-0 border-border'>release_date</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => {
            const isExpanded = expandedRows.includes(album.id);
            const hasProjects = !!album.projects.length;

            return (
              <Fragment key={album.id}>
                <tr key={album.id}>
                  <td className='text-nowrap p-3 border border-l-0 border-border hover hover:bg-background-mid' onClick={() => handlePencilClick(album)}>
                    <Pencil size={12} strokeWidth={1.25} />
                  </td>
                  <td className={`text-nowrap p-3 border border-border ${hasProjects && 'hover hover:bg-background-mid'}`} onClick={hasProjects ? () => handleRowClick(album.id) : undefined}>
                    <p className='flex items-center gap-1.5'>
                      {hasProjects && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)} {album.title}
                    </p>
                  </td>
                  <td className='text-nowrap p-3 border border-border'>{album.notes}</td>
                  <td className='text-nowrap p-3 border border-border'>{album.release_date && formatReadableDate(album.release_date)}</td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td></td>
                    <td colSpan={3}>
                      <ol>
                        {album.projects.map((project) => (
                          <li key={project.id} className='p-3 list-inside list-decimal'>
                            {project.title}
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
  );
}
