import { getDatabase } from '@/database.ts';
import { ContributorFormData } from '@/pages/Contributors.tsx';
import { Contributor } from '@/types.ts';
import { apiError } from '@/utils.ts';

export const fetchContributors = async () => {
  try {
    const db = await getDatabase();

    const contributors = await db.select<Contributor[]>(`
    SELECT * FROM contributors;
  `);
    return contributors;
  } catch (error) {
    apiError(error);
  }
};

export const createContributor = async (data: ContributorFormData) => {
  try {
    const db = await getDatabase();

    await db.execute(
      `INSERT INTO contributors (artist_name, first_name) VALUES ($1, $2)`,
      [data.artist_name, data.first_name],
    );

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};

export const updateContributor = async ({
  id,
  data,
}: {
  id: number;
  data: ContributorFormData;
}) => {
  try {
    const db = await getDatabase();

    await db.execute(
      `UPDATE contributors SET artist_name = $2, first_name = $3 WHERE id = $1`,
      [id, data.artist_name, data.first_name],
    );

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};

export const deleteContributor = async (id: number) => {
  try {
    const db = await getDatabase();

    await db.execute(`DELETE FROM contributors WHERE id = $1`, [id]);

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};
