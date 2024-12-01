import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  dimensions?: { w: number, h: number; };
}

export default function Modal({ isOpen, closeModal, children, dimensions = { w: 64, h: 64 } }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  function handlePageClick(event: MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

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
        <div ref={modalRef} className={`z-10 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-4 bg-primary rounded-lg shadow-lg text-secondary w-${dimensions.w} min-h-${dimensions.h}`}>
          {children}
        </div>
      )}
    </>
  );
}