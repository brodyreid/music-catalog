import { useEffect, useState } from 'react';
import './App.css';

interface Project {
  project_id: number;
  project_number?: number;
  title?: string;
  folder_path?: string;
  date_created?: Date;
}

function App() {
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
    <div>
      <h2>Current projects</h2>
      {projects.map(project => (
        <div key={project.project_id}>
          {project.title}
        </div>
      ))}
    </div>
  );
}

export default App;
