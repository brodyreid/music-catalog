const getProjectsData = require('../src/getProjectsData.js');
const getVersionsData = require('../src/getVersionsData.js');
const pool = require('../src/pool.js');

const baseDir = process.argv[2];
if (!baseDir) {
  console.error('Please provide a base directory path');
  process.exit(1);
}

async function insertData() {
  try {
    await insertProjects(baseDir);
    await insertVersions(baseDir);
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

insertData().finally(() => console.info('Script finished.'));