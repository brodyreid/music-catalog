import getProjectsData from '../src/getProjectsData';
import getVersionsData from '../src/getVersionsData';

const table = process.argv[2]; // 'projects' | 'versions'
const baseDir = process.argv[3];
if (!table) {
  console.error('Please provide a table name: "projects" | "versions"');
  process.exit(1);
}
if (!baseDir) {
  console.error('Please provide a base directory path');
  process.exit(1);
}

if (table === 'projects') {
  getProjectsData(baseDir).then(result => console.info(result)).finally(() => console.info('Script finished.'));
} else if (table === 'versions') {
  getVersionsData(baseDir).then(result => console.info(result)).finally(() => console.info('Script finished.'));
} else {
  console.error('Table name was not one of the allowed values: "projects" | "versions")');
  process.exit(1);
}