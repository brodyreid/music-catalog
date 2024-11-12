import { useState, useEffect } from "react";

interface Project {
  project_id: number;
  project_number?: number;
  title?: string;
  folder_path?: string;
  date_created?: Date;
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
        <table>
          <thead>
            
          </thead>
          <tr className="font-mono">
            <th>project_id</th>
            <th>project_number</th>
            <th>title</th>
            <th>folder_path</th>
            <th>date_created</th>
          </tr>
          {projects.map(project => (
            <div key={project.project_id}>
              {project.title}
            </div>
          ))}
        </table>
      </>
  );
}