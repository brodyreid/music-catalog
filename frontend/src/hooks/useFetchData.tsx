import { useEffect, useState } from 'react';

export default function useFetchData<T>(url: string | null, options: { skip?: boolean } = {}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url!);
      const data = (await response.json()) as T[];
      setData(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      setData([]);
      setLoading(false);
      setError(error as Error);
    }
  };

  useEffect(() => {
    if (!url || options.skip) {
      return;
    }

    setData([]);
    fetchData();
  }, [url, options.skip]);

  return { data, loading, error, refetch: fetchData };
}
