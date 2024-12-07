const fs = require('fs').promises;
const path = require('path');
const { createDeterministicId } = require('./utils');

async function getVersions(projectPath) {
  try {
    const files = await fs.readdir(projectPath);
    const versions = files.filter(f => f.endsWith('.als'));

    return versions;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function scanDirectory(baseDir) {
  try {
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const results = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(baseDir, entry.name);

      if (entry.name.endsWith(' Project')) {
        const metadata = await fs.stat(fullPath);
        const versions = await getVersions(fullPath);
        const projectName = entry.name;
        const id = createDeterministicId(projectName);

        return {
          id,
          projectName,
          parentDirectory: baseDir,
          dateCreated: metadata.birthtime,
          versions
        };
      }

      if (entry.isDirectory()) {
        return scanDirectory(fullPath);
      }

      return null;
    }));

    return results.flat().filter(r => r);
  } catch (error) {
    console.error(error);
    return [];
  }
}


module.exports = scanDirectory;