import { useState } from 'react';

export const ProjectsScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDirectoryPickerSupport = async () => {
    if (!('showDirectoryPicker' in window)) {
      return 'showDirectoryPicker not in window';
    }
    try {
      const handle = await (window as any).showDirectoryPicker();
      // If we get here, it worked!
      return 'we got handle';
    } catch (error) {
      // Check specifically for NotSupportedError
      if (error instanceof Error && error.name === 'NotSupportedError') {
        return 'not supported error';
      }
      // If it's an AbortError (user cancelled) or SecurityError (permission denied),
      // the API is actually working
      if (
        error instanceof Error &&
        (error.name === 'AbortError' || error.name === 'SecurityError')
      ) {
        return 'abort or security';
      }
      // For any other errors, assume the API isn't working properly
      return 'general false';
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const isDirectoryPickerSupported = await checkDirectoryPickerSupport();
      console.log(isDirectoryPickerSupported);
      const dirHandle: FileSystemDirectoryHandle = await (
        window as any
      ).showDirectoryPicker({
        mode: 'read',
      });
      // const subDir = currentDirHandle.getDirectoryHandle(dirName, { create: true });

      console.log('handle:', dirHandle.name);
      setIsScanning(false);
    } catch (error) {
      console.error('Permission error: ', error);
      setError(error instanceof Error ? error.message : 'Error while scanning directoy');
      setIsScanning(false);
    }
  };

  if (error) return <div className='text-red-600'>{error}</div>;

  return (
    <button
      type='button'
      disabled={isScanning}
      className='text-xs bg-green-700 px-2.5 py-1 rounded-md border border-green-500/50 hover flex items-center gap-2.5 justify-center'
      onClick={handleScan}>
      Scan
    </button>
  );
};
