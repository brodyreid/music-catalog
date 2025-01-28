import getProjectsData from '../src/getProjectsData.js';
import getVersionsData from '../src/getVersionsData.js';
import pool from '../src/pool.js';

const baseDir = process.argv[2];
if (!baseDir) {
  console.error('Please provide a base directory path');
  process.exit(1);
}

async function insertData() {
  try {
    await insertProjects(baseDir);
    await insertVersions(baseDir);
    await insertProjectContributorsFromFolder(baseDir);
  } catch (error) {
    console.error('Error inserting data: ', error);
  }
}

async function insertProjects(baseDir) {
  const client = await pool.connect();

  try {
    const projectsData = await getProjectsData(baseDir);

    for (const { id, title, folder_path, date_created } of projectsData) {
      try {
        await client.query(`
          INSERT INTO projects (id, title, folder_path, date_created)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id)
          DO NOTHING;
          `,
          [id, title, folder_path, date_created]
        );
      } catch (error) {
        console.error('Error inserting project: ', error);
      }
    }
  } catch (error) {
    console.error('Error inserting projects: ', error);
  } finally {
    client.release();
  }
}

async function insertVersions(baseDir) {
  const client = await pool.connect();

  try {
    const versionsData = await getVersionsData(baseDir);

    for (const { id, name, project_id } of versionsData) {
      try {
        await client.query(`
          INSERT INTO versions (id, name, project_id)
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO NOTHING;
          `,
          [id, name, project_id]
        );
      } catch (error) {
        console.error('Error inserting version: ', error);
      }
    }
  } catch (error) {
    console.error('Error inserting versions: ', error);
  } finally {
    client.release();
  }
}

async function insertProjectContributorsFromFolder(baseDir) {
  const client = await pool.connect();

  try {
    const result = await pool.query(`
      SELECT * FROM contributors;
      `);
    const contributors = result.rows;
    const projectsData = await getProjectsData(baseDir);

    for (const { id: projectId, folder_path } of projectsData) {
      for (const { id: contributorId, first_name, artist_name } of contributors) {
        const contributor = [first_name.toLowerCase(), artist_name.toLowerCase()];
        const firstLevelFolder = folder_path.replace(baseDir, '').split('/')[1].toLowerCase();

        if (contributor.includes(firstLevelFolder)) {
          await client.query(`
            INSERT INTO project_contributors (project_id, contributor_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `, [projectId, contributorId]);
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
}

insertData().finally(() => console.info('Script finished.'));