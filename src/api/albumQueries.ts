import db from '@/database.ts';
import { AlbumFormData } from '@/pages/Albums.tsx';
import { Album, AlbumWithProjects, Project } from '@/types.ts';
import { apiError } from '@/utils.ts';

export const fetchAlbums = async () => {
  try {
    const albumsRaw = await db.select<Array<Album & { projects: string }>>(`
    SELECT
      a.*,
      CASE
        WHEN COUNT(p.id) = 0 THEN json('[]')
        ELSE
        json_group_array(
          json_object(
            'id', p.id, 'title', p.title, 'release_name', p.release_name, 'notes', p.notes, 'folder_path_hash', p.folder_path_hash, 'date_created', p.date_created, 'bpm', p.bpm, 'musical_key', p.musical_key, 'path', p.path
          )
        )
      END AS projects
    FROM albums a
    LEFT JOIN album_projects ap on ap.album_id = a.id
    LEFT JOIN projects p on p.id = ap.project_id
    GROUP BY a.id;
  `);

    const albums: Array<AlbumWithProjects> = albumsRaw.map((a) => ({
      ...a,
      projects: JSON.parse(a.projects),
    }));

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

    for (const [index, project] of projects.entries()) {
      await db.execute(
        `INSERT INTO album_projects (album_id, project_id, position) VALUES ($1, $2, $3)`,
        [id, project.id, index],
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
