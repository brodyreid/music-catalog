import supabase from '@/supabase.ts';
import { ProjectWithAll } from '@/types/index.ts';
import { formatReadableDate } from '@/utils.ts';
import { Minus, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectWithAll[]>([]);
  const [editingAlbumId, setEditingId] = useState<number | null>(null);

  const getProjects = async () => {
    const { data, error } = await supabase.from('projects').select(`*, contributors ( * ), albums ( * )`);
    if (error) {
      throw new Error(error.message);
    }

    setProjects(data);
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleEdit = (project: ProjectWithAll) => {
    console.log(project.id);
  };

  const nullableCell = (value: any) => value || <Minus size={16} className='text-text-muted/80' />;

  return (
    <>
      {/* Table */}
      <table className='w-full h-full text-sm table-auto border-collapse border-spacing-0'>
        <thead>
          <tr className='text-left bg-background-mid'>
            <th className='p-3 font-bold border border-t-0 border-l-0 border-border'></th>
            <th className='p-3 font-bold border border-t-0 border-border'>title</th>
            <th className='p-3 font-bold border border-t-0 border-border'>folder_path</th>
            <th className='p-3 font-bold border border-t-0 border-border'>release_name</th>
            <th className='p-3 font-bold border border-t-0 border-border'>notes</th>
            <th className='p-3 font-bold border border-t-0 border-border'>date_created</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className='text-nowrap p-3 border border-l-0 border-border hover hover:bg-background-mid' onClick={() => handleEdit(project)}>
                <Pencil size={12} strokeWidth={1.25} />
              </td>
              <td className='text-nowrap p-3 border border-border'>{project.title}</td>
              <td className='text-nowrap p-3 border border-border'>{nullableCell(project.folder_path)}</td>
              <td className='text-nowrap p-3 border border-border'>{nullableCell(project.release_name)}</td>
              <td className='text-nowrap p-3 border border-border max-w-128 truncate'>{nullableCell(project.notes)}</td>
              <td className='text-nowrap p-3 border border-border'>{project.date_created ? formatReadableDate(project.date_created) : <Minus size={16} className='text-text-muted/80' />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
