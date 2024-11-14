import { Project } from './Projects.tsx';

export default function ProjectsTable({ projects }: { projects: Project[]; }) {
  return (
    <div className="mt-16">
      <table className="font-mono leading-8">
        <thead>
          <tr className='text-left border-b'>
            <th className='pr-8'>id</th>
            <th className='pr-8'>number</th>
            <th className='pr-8'>title</th>
            <th className='pr-8'>path</th>
            <th>date_created</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(({ project_id, project_number, title, folder_path, date_created }) => (
            <tr key={project_id}>
              <td className='text-nowrap pr-8'>{project_id}</td>
              <td className='text-nowrap pr-8'>{project_number}</td>
              <td className='text-nowrap pr-8'>{title}</td>
              <td className='text-nowrap pr-8'>{folder_path}</td>
              <td className="text-nowrap ">{date_created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}