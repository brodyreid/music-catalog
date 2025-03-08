import { join } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import { DirEntry, readDir, readFile, stat, writeFile } from '@tauri-apps/plugin-fs';
import { XMLParser } from 'fast-xml-parser';
import { ungzip } from 'pako';

const ProjectsScanner = () => {
  const parseAlsFile = async (filePath: string) => {
    try {
      const fileContent = await readFile(filePath);
      const decompressedContent = ungzip(fileContent);
      const xmlString = new TextDecoder('utf-8').decode(decompressedContent);

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
      });

      const parsedData = parser.parse(xmlString);

      return parsedData;
    } catch (error) {
      console.error(error);
    }
  };

  const extractData = async (filePath: string) => {
    try {
      const parsedData = parseAlsFile(filePath) as any;

      const id: string = parsedData.Ableton.Revision;
      const tempo: number | null =
        parseInt(
          parsedData.Ableton.LiveSet.MasterTrack.DeviceChain.Mixer.Tempo.Manual.Value,
        ) || null;

      const fileStats = await stat(filePath);
      const dateCreated = fileStats.birthtime?.toDateString() || null;

      return {
        id,
        dateCreated,
        tempo,
        filePath,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async () => {
    try {
      const baseDir = await open({
        multiple: false,
        directory: true,
      });

      if (!baseDir) {
        return;
      }

      console.log(`Base Directory: ${baseDir}`);

      let entries: Array<DirEntry & { path: string }> = [];

      const scanDirectory = async (currentDir: string) => {
        try {
          console.log(`Scanning Directory: ${currentDir}`);
          const children = await readDir(currentDir);

          for (const entry of children) {
            const entryPath = await join(currentDir, entry.name);
            console.log(`Processing Entry: ${entryPath}`);

            if (entry.isFile && entry.name.endsWith('.als')) {
              console.log(`IS FILE: ${JSON.stringify(entry, null, 2)}`);
              entries.push({ path: currentDir, ...entry });
            } else if (
              entry.isDirectory &&
              !['Backup', 'Samples', 'Ableton Project Info', 'Presets'].includes(
                entry.name,
              )
            ) {
              console.log(`IS DIR: ${JSON.stringify(entry, null, 2)}`);
              await scanDirectory(entryPath);
            }
          }
        } catch (error) {
          console.error(`Error accessing path: ${currentDir}\n`, error);
        }
      };

      scanDirectory(baseDir);

      const jsonString = JSON.stringify(entries, null, 2);
      const encodedData = new TextEncoder().encode(jsonString);
      await writeFile('/Users/brodyreid/Desktop/entries.json', encodedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        type='button'
        className='px-2.5 py-1.5 border border-zinc-400 rounded hover text-sm'
        onClick={handleClick}>
        Choose Directory
      </button>
    </>
  );
};

export default ProjectsScanner;

// import { dirname } from '@tauri-apps/api/path';
// const baseDir = await dirname('/path/to/somedir/');
// assert(baseDir === 'somedir');

// import { basename } from '@tauri-apps/api/path';
// const base = await basename('path/to/app.conf');
// assert(base === 'app.conf');

// import { extname } from '@tauri-apps/api/path';
// const ext = await extname('/path/to/file.html');
// assert(ext === 'html');

// [object] Ableton.LiveSet.MasterTrack.DeviceChain.Mixer.Tempo.Manual.Value

// interface LiveSet
// id: String;
// name: String;
// creationTime: DateTime;
// dateModified: DateTime;
// majorVersion: String;
// minorVersion: String;
// tempo: Tempo;
// timeSignature: TimeSignature;
