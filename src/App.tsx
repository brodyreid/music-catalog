import { useEffect, useState } from 'react';
import './App.css';

interface Project {
  project_id: number;
  project_number?: number;
  title?: string;
  folder_path?: string;
  date_created?: Date
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost/projects');
        const data = await response.json() as Project[];
        setProjects(data);
      } catch (err) {
        console.error(err);
        throw new Error('oopsy daisy did i do that?');
      }
    })();
  }, []);
  return (
    <div>
    {projects.length ? `<pre>${projects[0]}</pre>` : "negative gamers, we'll get em next time"}
    </div>
  );
}

export default App;
