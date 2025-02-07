import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const Loading = () => (
  <div className='p-4'>
    <Skeleton count={3} baseColor='var(--color-border)' highlightColor='var(--color-text-muted)' height={32} className='my-2' />
  </div>
);
