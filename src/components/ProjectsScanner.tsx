import { Folders, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface FileSystemHandleWithValues extends FileSystemDirectoryHandle {
  values(): AsyncIterableIterator<FileSystemFileHandle | FileSystemHandleWithValues>;
}

type FileAndPath = { file: FileSystemHandleWithValues; path: string };

export const ProjectsScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDirectoryPickerSupport = async () => {
    if ('showDirectoryPicker' in window) {
      return true;
    }
    return false;
  };

  const scanDirectory = async (
    baseDirectory: FileSystemHandleWithValues,
    path: string = '',
  ) => {
    // const files: FileAndPath[] = [];
    const projectData: any[] = [];

    for await (const child of baseDirectory.values()) {
      const currentPath = `${path}/${child.name}`;

      if (child.kind === 'file' && child.name.endsWith('.als')) {
        const entry = {
          title: child.name,
          path: currentPath,
          // folder_path_hash,
          date_created: null,
          bpm: null,
          musical_key: null,
          notes: null,
          release_name: null,
        };
        projectData.push(entry);
        // files.push({ file: child, path: currentPath } as FileAndPath);
      } else if (
        child.kind === 'directory' &&
        !['Ableton Project Info', 'Backup', 'Samples'].includes(child.name)
      ) {
        const subFiles = await scanDirectory(child, currentPath);
        projectData.push(...subFiles);
      }
    }

    return projectData;
  };

  const readConfig = async (directory: FileSystemHandleWithValues) => {
    for await (const fileHandle of directory.values()) {
      const file = await (fileHandle as FileSystemFileHandle).getFile();
      const buffer = await file.arrayBuffer();
      const dataView = new DataView(buffer);

      // Look for "CreationDate" in UTF-16 LE
      const encoder = new TextEncoder();
      const creationDateMarker = encoder.encode('CreationDate');
      let offset = 0;

      // Find the position of "CreationDate" in the binary data
      while (offset < buffer.byteLength) {
        const slice = new Uint8Array(buffer, offset, creationDateMarker.length);
        if (slice.every((val, i) => val === creationDateMarker[i])) {
          offset += creationDateMarker.length;
          break;
        }
        offset++;
      }

      // Extract the timestamp (example: 4-byte little-endian)
      const timestamp = dataView.getUint32(offset, true); // Adjust byte length if needed
      const date = new Date(timestamp * 1000); // Convert Unix timestamp (if applicable)

      return { creationDate: date.toISOString() };
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const isDirectoryPickerSupported = await checkDirectoryPickerSupport();
      if (!isDirectoryPickerSupported) {
        setError('showDirectoryPicker API is not supported.');
        return;
      }

      const baseDir = await (window as any).showDirectoryPicker();
      const alsFiles = await scanDirectory(baseDir, baseDir.name);
      const configFile = await readConfig(baseDir);
      console.log(configFile);

      // console.log(alsFiles);
      return alsFiles;
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error while scanning directoy');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className='flex items-center'>
      <button
        type='button'
        disabled={isScanning}
        className='mx-4 text-sm px-2.5 py-1 text-text/80 rounded-md border border-text-muted/65 hover flex items-center gap-2.5 justify-center'
        onClick={handleScan}>
        {isScanning ? (
          <LoaderCircle
            className='text-text-muted/75 animate-spin'
            strokeWidth={2}
            width={16}
            height={16}
          />
        ) : (
          <div className='flex items-center gap-2'>
            <Folders strokeWidth={1.25} width={16} height={16} />
            <p>Scan Projects</p>
          </div>
        )}
      </button>
      <div className='text-red-600 text-sm'>{error}</div>
    </div>
  );
};
