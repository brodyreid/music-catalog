import { useBulkInsertProjects } from '@/hooks/useProjects.ts';
import { Project } from '@/types.ts';
import { generateHash } from '@/utils.ts';
import { join } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import { DirEntry, readDir, readFile, stat, writeFile } from '@tauri-apps/plugin-fs';
import { XMLParser } from 'fast-xml-parser';
import { ungzip } from 'pako';
import { useState } from 'react';

const ProjectsScanner = () => {
  const [isInserting, setIsInserting] = useState(false);
  const { bulkInsertProjects } = useBulkInsertProjects();

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

  const extractAlsData = async (filePath: string) => {
    try {
      const parsedData = await parseAlsFile(filePath);
      const bpm: number | null =
        parseInt(
          parsedData.Ableton.LiveSet.MasterTrack.DeviceChain.Mixer.Tempo.Manual.Value,
        ) || null;

      const fileStats = await stat(filePath);
      const id = await generateHash(`${fileStats.ino}_${fileStats.birthtime?.getTime()}`);
      const dateCreated = fileStats.birthtime?.toDateString() || null;

      return {
        id,
        bpm,
        dateCreated,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const scanDirectory = async (
    currentDir: string,
    entries: Array<DirEntry & { path: string }>,
  ) => {
    try {
      const children = await readDir(currentDir);

      for (const entry of children) {
        const entryPath = await join(currentDir, entry.name);

        if (entry.isFile && entry.name.endsWith('.als')) {
          console.log(`IS FILE: ${JSON.stringify(entry, null, 2)}`);
          entries.push({ path: currentDir, ...entry });
        } else if (
          entry.isDirectory &&
          ![
            'Backup',
            'Samples',
            'Ableton Project Info',
            'Presets',
            'splice_folder',
          ].includes(entry.name)
        ) {
          console.log(`IS DIR: ${JSON.stringify(entry, null, 2)}`);
          await scanDirectory(entryPath, entries);
        }
      }
    } catch (error) {
      console.error(`Error accessing path: ${currentDir}\n`, error);
    }
  };

  const handleClick = async () => {
    setIsInserting(true);

    try {
      const baseDir = await open({
        multiple: false,
        directory: true,
      });

      if (!baseDir) {
        return;
      }

      let entries: Array<DirEntry & { path: string }> = [];
      await scanDirectory(baseDir, entries);

      const alsFiles: Omit<
        Project,
        'id' | 'musical_key' | 'notes' | 'release_name' | 'created_at' | 'updated_at'
      >[] = [];
      for (const entry of entries) {
        const alsData = await extractAlsData(await join(entry.path, entry.name));

        if (!alsData) {
          console.error(`No ALS data in file ${entry.name}`);
        } else {
          const { id, bpm, dateCreated } = alsData;

          alsFiles.push({
            title: entry.name,
            bpm,
            als_uid: id,
            path: entry.path,
            date_created: dateCreated,
          });
        }
      }

      const jsonString = JSON.stringify(alsFiles, null, 2);
      const encodedData = new TextEncoder().encode(jsonString);
      await writeFile('/Users/brodyreid/Desktop/entries.json', encodedData);
      bulkInsertProjects(alsFiles);
    } catch (error) {
      console.error(error);
    } finally {
      setIsInserting(false);
    }
  };

  return (
    <>
      <button
        type='button'
        className='px-2.5 py-1.5 border border-zinc-400 rounded not-disabled:hover text-sm disabled:border-zinc-700 disabled:select-none'
        disabled={isInserting}
        onClick={handleClick}>
        {isInserting ? (
          <div className='w-4 h-4 border-[1.5px] border-text-muted/20 border-t-text-muted/75 rounded-full animate-spin'></div>
        ) : (
          'Choose Directory'
        )}
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
