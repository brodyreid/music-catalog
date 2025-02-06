import supabase from '@/supabase.ts';
import { ProjectWithAll } from '@/types/index.ts';
import { useEffect, useState } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectWithAll[] | null>(null);

  useEffect(() => {
    const getProjects = async () => {
      const { data: entries, error }: { data: ProjectWithAll[] | null; error: any } = await supabase.from('projects').select(`
        *,
        contributors ( * ),
        albums ( * )
        `);
      if (error) {
        throw new Error(error.message);
      }

      setProjects(entries);
    };

    getProjects();
  }, []);

  return (
    <>
      <div className='flex items-start justify-between'>
        {projects?.length && (
          <ul>
            {projects.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
