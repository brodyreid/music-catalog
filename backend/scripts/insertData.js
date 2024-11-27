const insertProjects = require('./insertProjects.js');
const insertVersions = require('./insertVersions.js');

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

insertData().finally(() => console.info('Script finished.'));