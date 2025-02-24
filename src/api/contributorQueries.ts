import db from '@/database.ts';
import { Contributor } from '@/types.ts';

export const fetchContributors = async () => {
  const contributors = await db.select<Contributor[]>(`
    SELECT * FROM contributors;
  `);
  return contributors;
};
