import { Skeleton } from '@/components/Skeleton.tsx';

const LoadingBars = () => (
  <div className='p-4'>
    <Skeleton
      count={3}
      baseColor='var(--color-border)'
      highlightColor='var(--color-text-muted)'
      height={28}
      className='my-2'
    />
  </div>
);

export default LoadingBars;
