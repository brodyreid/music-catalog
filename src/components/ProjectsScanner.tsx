import { open } from '@tauri-apps/plugin-dialog';
import { readDir } from '@tauri-apps/plugin-fs';
import { useState } from 'react';

const ProjectsScanner = () => {
  const [directory, setDirectory] = useState<string | null>(null);

  const chooseDirectory = async () => {
    try {
      const dir = await open({
        multiple: false,
        directory: true,
      });

      if (dir) {
        const entries = await readDir(dir);
        console.log('Entries:', entries);
        console.log('Directory:', dir);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        type='button'
        className='px-2.5 py-1.5 border border-zinc-400 rounded hover text-sm'
        onClick={chooseDirectory}>
        Choose Directory
      </button>
      {directory && <p className='text-xs ml-4'>Selected: {directory}</p>}
    </>
  );
};

export default ProjectsScanner;

// import { dirname } from '@tauri-apps/api/path';
// const dir = await dirname('/path/to/somedir/');
// assert(dir === 'somedir');

// import { basename } from '@tauri-apps/api/path';
// const base = await basename('path/to/app.conf');
// assert(base === 'app.conf');

// import { extname } from '@tauri-apps/api/path';
// const ext = await extname('/path/to/file.html');
// assert(ext === 'html');
