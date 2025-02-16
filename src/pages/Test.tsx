import { DataTyper, getAllProjects } from '@/api/projectQueries.ts';
import { useEffect, useState } from 'react';

export default function Test() {
  const [data, setData] = useState<DataTyper>([]);

  useEffect(() => {
    const getData = async () => {
      const res = await getAllProjects();
      setData(res);
    };

    getData();
  }, []);
  return <div>{!data ? 'no data babbbyyy' : JSON.stringify(data)}</div>;
}
