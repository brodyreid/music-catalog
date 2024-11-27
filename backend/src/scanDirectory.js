const fs = require('fs').promises;
const path = require('path');
const { createDeterministicId } = require('./utils');
// const { stringify } = require('csv-stringify');


// const generateCSV = (data, fileName) => {
//   stringify(data, { header: true }, async (error, output) => {
//     if (error) {
//       console.error(error);
//       return;
//     }

//     try {
//       const fullFilePath = path.join(process.cwd(), '/data/', fileName);

//       await fs.writeFile(fullFilePath, output).then(() => console.log(`CSV has been generated at ${fullFilePath}`));
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   );
// };
// const main = async () => {
//   console.log('Getting paths and generating CSV...');
//   try {
//     const { projectsData, versionsData } = await getPaths(baseDir).then(result => cleanData(result)).catch(console.error);
//     // console.log('projects\n', projectsData);
//     // console.log('versions\n', versionsData);
//     generateCSV(projectsData, 'projects.csv');
//     generateCSV(versionsData, 'versions.csv');
//   } catch (error) {
//     console.error(error);
//   }
// };


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