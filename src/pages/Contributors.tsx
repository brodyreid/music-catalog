import { Loading } from '@/components/Loading.tsx';
import supabase from '@/supabase.ts';
import { useQuery } from '@tanstack/react-query';

export default function Contributors() {
  const getContributors = async () => {
    const { data, error } = await supabase.from('contributors').select(`
      *
      `);
    if (error) {
      throw error;
    }
    return data;
  };

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contributors'],
    queryFn: getContributors,
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className={`flex gap-16 mt-16`}>
        <table className='text-sm border-separate border-spacing-2'>
          <thead>
            <tr className='text-left border-b'>
              <th className='pr-3'>first_name</th>
              <th className='pr-3'>artist_name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((contributor) => {
              const { id, first_name, artist_name } = contributor;
              return (
                <tr key={id} className={`relative cursor-pointer hover`}>
                  <td className='text-nowrap pr-3'>{first_name}</td>
                  <td className='text-nowrap pr-3'>{artist_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
