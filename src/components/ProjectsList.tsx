import { useState, useEffect } from "react";

interface Project {
  project_id: number;
  project_number?: number;
  title?: string;
  folder_path?: string;
  notes?: string;
  date_created?: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/projects');
        const data = await response.json() as Project[];
        setProjects(data);
      } catch (err) {
        console.error(err);
        throw new Error('oopsy daisy did i do that?');
      }
    })();
  }, []);

  if (!projects.length) {
    return (
      <div>Sorry gamer, we couldn't find any projects :/</div>
    );
  }

  return (
   <>
      <h2 className="mb-8">Current projects</h2>
      <div className="flex justify-center">
        <table className="font-mono leading-8">
          <thead>
            <tr className='text-left border-b'>
              <th className='pr-8'>id</th>
              <th className='pr-8'>number</th>
              <th className='pr-8'>title</th>
              <th className='pr-8'>path</th>
              <th className='pr-8'>notes</th>
              <th className=''>date_created</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(({ project_id, project_number, title, folder_path, notes, date_created }) => (
              <tr key={project_id}>
                <td className='pr-8'>{project_id}</td>
                <td className='pr-8'>{project_number}</td>
                <td className='pr-8'>{title}</td>
                <td className='pr-8'>{folder_path}</td>
                <td className='pr-8'>{notes}</td>
                <td>{date_created && new Date(date_created).toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   </>
  );
}