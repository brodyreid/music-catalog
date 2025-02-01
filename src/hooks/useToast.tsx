import Cross from '@/icons/Cross.tsx';
import { useState } from 'react';

export default function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const ToastComponent = () => {
    if (!toastMessage) {
      return;
    }

    return (
      <div className='absolute z-10 bottom-5 right-5 p-4 bg-green-700 w-64 h-24 rounded-md shadow-lg flex items-center justify-center'>
        <button onClick={() => setToastMessage(null)}>
          <Cross className='absolute top-2 right-2 w-4' />
        </button>
        {toastMessage}
      </div>
    );
  };

  return { showToast, ToastComponent };
}
