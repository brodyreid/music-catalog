const getProjectsData = require('../src/getProjectsData.js');
const pool = require('../src/pool.js');

const baseDir = process.argv[2];
if (!baseDir) {
  console.error('Please provide a base directory path');
  process.exit(1);
}

async function insertProjectContributorsFromFolder() {
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

insertProjectContributorsFromFolder().finally(() => console.log('Done'));
