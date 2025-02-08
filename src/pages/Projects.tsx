import { Loading } from '@/components/Loading.tsx';
import { useGetProjects } from '@/hooks/useProjects.ts';
import { Project, ProjectWithAll } from '@/types/index.ts';
import { formatReadableDate } from '@/utils.ts';
import { Minus, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = Omit<Project, 'id'>;

export default function Projects() {
  const [editingAlbumId, setEditingId] = useState<string | null>(null);
  const { data: projects = [], isLoading, error } = useGetProjects();
  const {
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleEdit = (project: ProjectWithAll) => {
    reset({});
    setEditingId(project.id);
  };

  const closeModal = () => {
    reset({});
    setEditingId(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
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
