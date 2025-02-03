import { Disc3, Library, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const activeTab = (pathname: string) => (location.pathname === pathname ? 'active-tab' : 'hover:bg-gray-700/50');

  return (
    <div className='w-64 border-r border-tertiary'>
      <div className='flex flex-col gap-4 mt-8 m-4 text-text-muted'>
        <Link to={'/projects'} className={`rounded-md duration-300 flex gap-2 p-2 ${activeTab('/projects')}`}>
          <Library strokeWidth={1.25} /> Projects
        </Link>
        <Link to={'/albums'} className={`rounded-md duration-300 flex gap-2 p-2 ${activeTab('/albums')}`}>
          <Disc3 strokeWidth={1.25} /> Albums
        </Link>
        <Link to={'/contributors'} className={`rounded-md duration-300 flex gap-2 p-2 ${activeTab('/contributors')}`}>
          <Users strokeWidth={1.25} /> Contributors
        </Link>
      </div>
    </div>
  );
}
