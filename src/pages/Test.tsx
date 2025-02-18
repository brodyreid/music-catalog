import { useTestFetch } from '@/hooks/useProjects.ts';

export default function Test() {
  const {
    data: { projects, count, hasMore } = {
      projects: [],
      count: null,
      hasMore: false,
    },
  } = useTestFetch();

  return (
    <pre>{!projects ? 'no projects babbbyyy' : JSON.stringify(projects, null, 2)}</pre>
  );
}
