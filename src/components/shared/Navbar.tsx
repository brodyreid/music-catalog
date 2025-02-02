import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-1'>
        <img src='/logo.svg' alt='logo' className='w-12 h-12 m-4' />
        <h2 className='text-[#9D74B3]'>music-catalog</h2>
      </div>
      <div className='flex gap-4 p-4'>
        <Link to={'/projects'} className='hover h-fit'>
          projects
        </Link>
        <Link to={'/albums'} className='hover h-fit'>
          albums
        </Link>
        <Link to={'/contributors'} className='hover h-fit'>
          contributors
        </Link>
      </div>
    </div>
  );
}
