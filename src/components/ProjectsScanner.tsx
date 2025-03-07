import { open } from '@tauri-apps/plugin-dialog';
import { readDir, readFile, stat, writeFile } from '@tauri-apps/plugin-fs';
import { XMLParser } from 'fast-xml-parser';
import { ungzip } from 'pako';

const ProjectsScanner = () => {
  const chooseDirectory = async () => {
    try {
      const dir = await open({
        multiple: false,
        directory: true,
      });

      if (!dir) {
        return;
      }

      const entries = await readDir(dir);
      const alsFile = entries.find((e) => e.name.endsWith('.als'));

      if (!alsFile) {
        return;
      }

      const filePath = `${dir}/${alsFile.name}`;
      const fileStats = await stat(filePath);
      console.log(fileStats);
      const fileContent = await readFile(filePath);
      const decompressedContent = ungzip(fileContent);

      const xmlString = new TextDecoder('utf-8').decode(decompressedContent);

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
      });
      const parsedData = parser.parse(xmlString);
      const jsonString = JSON.stringify(parsedData, null, 2);
      const encodedData = new TextEncoder().encode(jsonString);
      await writeFile('/Users/brodyreid/Desktop/egg.json', encodedData);
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
