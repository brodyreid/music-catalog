import scanDirectory from './scanDirectory';

async function getProjectsData(baseDir) {
  try {
    const paths = await scanDirectory(baseDir);
    const projectsData = paths.flatMap(entry => {
      return {
        id: entry.id,
        title: entry.projectName,
        folder_path: entry.parentDirectory,
        date_created: entry.dateCreated
      };
    });

    return projectsData;
  } catch (error) {
    console.error(error);
  }
}

export default getProjectsData;