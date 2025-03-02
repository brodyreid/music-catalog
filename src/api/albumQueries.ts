import db from '@/database.ts';
import { AlbumFormData } from '@/pages/Albums.tsx';
import { AlbumWithProjects } from '@/types.ts';
import { apiError } from '@/utils.ts';

export const fetchAlbums = async () => {
  try {
    const albums = await db.select<AlbumWithProjects[]>(`
    SELECT * FROM albums;
  `);
    return albums;
  } catch (error) {
    apiError(error);
  }
};

export const createAlbum = async (data: AlbumFormData) => {
  try {
    const { projects, ...albumData } = data;

    const result = await db.execute(
      `INSERT INTO albums (title, release_date, notes) VALUES ($1, $2, $3)`,
      [albumData.title, albumData.release_date, albumData.notes],
    );

    if (!result.lastInsertId) {
      throw new Error(`Error inserting album: ${albumData.title}`);
    }

    for (const project of projects) {
      await db.execute(
        `INSERT INTO album_projects (album_id, project_id) VALUES ($1, $2)`,
        [result.lastInsertId, project.id],
      );
    }

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};

export const updateAlbum = async ({ id, data }: { id: number; data: AlbumFormData }) => {
  try {
    const { projects, ...albumData } = data;

    await db.execute(
      `UPDATE albums SET title = $2, release_date = $3, notes = $4 WHERE id = $1`,
      [id, albumData.title, albumData.release_date, albumData.notes],
    );

    await db.execute(`DELETE FROM album_projects WHERE album_id = $1`, [id]);

    for (const project of projects) {
      await db.execute(
        `INSERT INTO album_projects (album_id, project_id) VALUES ($1, $2)`,
        [id, project.id],
      );
    }

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};

export const deleteAlbum = async (id: number) => {
  try {
    await db.execute(`DELETE FROM albums WHERE id = $1`, [id]);

    return { success: true };
  } catch (error) {
    apiError(error);
  }
};
