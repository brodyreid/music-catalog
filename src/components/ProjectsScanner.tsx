import { Project } from '@/types/index.ts';
import { generateHash } from '@/utils.ts';
import { Folders, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface FileSystemHandleWithValues extends FileSystemDirectoryHandle {
  values(): AsyncIterableIterator<FileSystemHandle>;
}

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
    entry: FileSystemHandleWithValues,
    baseDir = '',
  ): Promise<Omit<Project, 'id'>[]> => {
    const results: Omit<Project, 'id'>[] = [];
    try {
      const currentPath = baseDir ? `${baseDir}/${entry.name}` : entry.name;

      if (entry.name.endsWith(' Project')) {
        const folder_path_hash = await generateHash(currentPath);
        const projectData = {
          title: entry.name,
          folder_path: currentPath,
          folder_path_hash,
          date_created: null,
          bpm: null,
          musical_key: null,
          notes: null,
          release_name: null,
        };
        results.push(projectData);
      } else {
        for await (const handle of entry.values()) {
          if (handle.kind === 'directory') {
            const subDirectoryResults = await scanDirectory(
              handle as FileSystemHandleWithValues,
              currentPath,
            );
            results.push(...subDirectoryResults);
          }
        }
      }
      return results;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'error babyyyy');
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

      const entry: FileSystemHandleWithValues = await (window as any).showDirectoryPicker(
        {
          mode: 'read',
        },
      );

      const results = await scanDirectory(entry);
      console.log(results);

      // await insert
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error while scanning directoy');
    } finally {
      setIsScanning(false);
    }
  };

  if (error) return <div className='text-red-600'>{error}</div>;

  return (
    <button
      type='button'
      disabled={isScanning}
      className='ml-4 text-sm px-2.5 py-1 text-text/80 rounded-md border border-text-muted/65 hover flex items-center gap-2.5 justify-center'
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
  );
};
