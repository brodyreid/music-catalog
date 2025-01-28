const express = require('express');
const cors = require('cors');
const pool = require('./pool');
const { serverError } = require('./utils');

const app = express();
app.use(express.json()).use(cors({ origin: process.env.ORIGIN_URL }));

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Routes
app.get('/projects', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      p.id,
      to_jsonb(p.*) as project,
      JSONB_AGG(DISTINCT jsonb_build_object('id', c.id, 'first_name', c.first_name, 'artist_name', c.artist_name)) FILTER (WHERE c.id IS NOT NULL) AS contributors,
      JSONB_AGG(DISTINCT jsonb_build_object('id', v.id, 'name', v."name")) FILTER (WHERE v.id IS NOT NULL) AS versions
      FROM projects p
      LEFT JOIN project_contributors pc ON pc.project_id = p.id
      LEFT JOIN contributors c ON c.id = pc.contributor_id
      LEFT JOIN versions v ON v.project_id = p.id
      GROUP BY p.id
      ORDER BY p.date_created DESC;
      `);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
  }
});

app.post('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { release_name, notes, bpm, musical_key, contributor_ids } = req.body;
  const client = await pool.connect();

  if (!id) {
    return res.status(400).send('Bad id');
  }

  try {
    await client.query('BEGIN');
    const projectResult = await client.query(`
      UPDATE projects
      SET release_name = $2, notes = $3, bpm = $4, musical_key = $5
      WHERE id = $1
      RETURNING *;
      `, [id, release_name, notes, bpm, musical_key]);

    if (contributor_ids?.length) {
      await client.query(`
        DELETE FROM project_contributors
        WHERE project_id = $1;  
      `, [id]);
      await client.query(`
        INSERT INTO project_contributors (project_id, contributor_id)
        SELECT $1, UNNEST($2::char(16)[])
        ON CONFLICT DO NOTHING;
      `, [id, contributor_ids]);
    }

    await client.query('COMMIT');

    return res.json({
      message: 'Project successfully updated!',
      data: projectResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    serverError(res, error);
  } finally {
    client.release();
  }
});

app.get('/contributors', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM contributors ORDER BY first_name DESC;
      `);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
  }
});

app.get('/contributors/:id/projects', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
        SELECT p.* FROM projects p
        JOIN project_contributors pc ON pc.project_id = p.id
        WHERE pc.contributor_id = $1;
      `, [id]);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
  }
});

app.post('/contributors/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, artist_name } = req.body;

  if (!id || (!first_name && !artist_name)) {
    return res.status(400).send('first_name AND artist_name cannot both be empty or bad id.');
  }

  try {
    const result = await pool.query(`
      INSERT INTO contributors (id, first_name, artist_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE
      SET first_name = COALESCE(EXCLUDED.first_name, contributors.first_name), artist_name = COALESCE(EXCLUDED.artist_name, contributors.artist_name)
      RETURNING *;
      `, [id, first_name, artist_name]);

    return res.json({
      message: 'Contributor successfully updated',
      data: result.rows[0]
    });
  } catch (error) {
    serverError(res, error);
  }
});

app.delete('/contributors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      DELETE FROM contributors WHERE id = $1
      `, [id]);

    return res.json({
      message: 'Contributor successfully deleted',
      data: result.rows[0]
    });
  } catch (error) {
    serverError(res, error);
  }
});

app.get('/albums', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, JSONB_AGG(p.*) FILTER (WHERE p.id IS NOT NULL) AS projects
      FROM albums a
      LEFT JOIN album_projects ap ON ap.album_id = a.id
      LEFT JOIN projects p ON p.id = ap.project_id
      GROUP BY a.id
      ORDER BY a.release_date DESC;
      `);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
  }
});

app.post('/albums/:id', async (req, res) => {
  const { id } = req.params;
  const { title, notes, release_date, project_ids } = req.body;

  if (!id) {
    return res.status(400).send('Bad id.');
  }

  try {
    await client.query('BEGIN');
    const albumResult = await pool.query(`
      INSERT INTO albums (id, title, notes, release_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id)
      DO UPDATE
      SET title = COALESCE(EXCLUDED.title, albums.title), notes = COALESCE(EXCLUDED.notes, albums.notes), release_date = COALESCE(EXCLUDED.release_date, albums.release_date)
      RETURNING *;
      `, [id, title, notes, release_date]);

    if (project_ids?.length) {
      await client.query(`
          DELETE FROM album_projects
          WHERE album_id = $1;  
        `, [id]);
      await client.query(`
          INSERT INTO album_projects (album_id, project_id)
          SELECT $1, UNNEST($2::char(16)[])
          ON CONFLICT DO NOTHING;
        `, [id, project_ids]);
    }

    await client.query('COMMIT');

    return res.json({
      message: 'Album successfully updated!',
      data: albumResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    serverError(res, error);
  } finally {
    client.release();
  }
});

app.delete('/albums/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      DELETE FROM albums WHERE id = $1
      `, [id]);

    return res.json({
      message: 'Album successfully deleted',
      data: result.rows[0]
    });
  } catch (error) {
    serverError(res, error);
  }
});