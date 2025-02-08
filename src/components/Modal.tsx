import { ReactNode, useEffect, useRef } from 'react';
import { LoadingDots } from './LoadingDots.tsx';

interface ModalProps {
  isOpen: boolean;
  isMutating: boolean;
  closeModal: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, isMutating, closeModal, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  function handlePageClick(event: MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (modalRef.current && event.key === 'Escape') {
      closeModal();
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handlePageClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handlePageClick);
      document.addEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          <div className='absolute inset-0 w-full h-full bg-black/65 z-40'></div>
          <div ref={modalRef} className={`z-50 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 `}>
            {isMutating && (
              <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-60'>
                <LoadingDots color='var(--color-text)' height={72} width={72} />
              </div>
            )}
            <div className={`p-4 bg-background rounded-lg shadow-lg text-text border border-border ${isMutating && 'opacity-50'}`}>{children}</div>
          </div>
        </>
      )}
    </>
  );
}
