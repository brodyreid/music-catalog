import { ProjectContributor } from '../types.ts';

export default function ProjectsWithContributorsTable({ projects }: { projects: ProjectContributor[]; }) {
  return (
    <div className="mt-16">
      <table className="font-mono leading-8">
        <thead>
          <tr className='text-left border-b'>
            <th className='pr-8'>id</th>
            <th className='pr-8'>title</th>
            <th className='pr-8'>path</th>
            <th className='pr-8'>notes</th>
            <th className='pr-8'>contributors</th>
            <th>date_created</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(({ id, title, folder_path, notes, date_created, contributors }) => (
            <tr key={id}>
              <td className='text-nowrap pr-8'>{id}</td>
              <td className='text-nowrap pr-8'>{title}</td>
              <td className='text-nowrap pr-8'>{folder_path && folder_path.replace(/^.*\/projects\//i, '/')}</td>
              <td className='text-nowrap pr-8'>{notes}</td>
              <td className='text-nowrap pr-8'>{contributors.join(', ')}</td>
              <td className="text-nowrap ">{date_created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}