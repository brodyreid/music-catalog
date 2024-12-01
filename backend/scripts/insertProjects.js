const getProjectsData = require('../src/getProjectsData.js');
const pool = require('../src/pool.js');

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

module.exports = insertProjects;