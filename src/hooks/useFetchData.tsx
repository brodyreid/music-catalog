import { useEffect, useState } from 'react';

interface FetchState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export default function useFetchData<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(url);
        const data = await response.json() as T[];
        setState({
          data,
          loading: false,
          error: null
        });
      } catch (error) {
        setState({ data: [], loading: false, error: error as Error });
      }
    })();
  }, [url]);

  return state;
}