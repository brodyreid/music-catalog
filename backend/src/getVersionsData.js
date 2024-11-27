const scanDirectory = require('./scanDirectory');
const { createDeterministicId } = require('./utils');

async function getVersionsData(baseDir) {
  try {
    const paths = await scanDirectory(baseDir);
    const versionsData = paths.flatMap(entry => {
      return entry.versions.map(version => {
        const cleanProjectName = entry.projectName.replace(' Project', '');
        const cleanVersionName = version.replace('.als', '');

        if (cleanProjectName === cleanVersionName) { return; }

        return {
          id: createDeterministicId(version),
          name: version,
          project_id: entry.id
        };
      });
    });

    return versionsData.filter(v => v);
  } catch (error) {
    console.error(error);
  }
}

module.exports = getVersionsData;