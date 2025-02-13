import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { MouseEvent } from 'react';

const SortableItem = <
  T extends { id: number; title: string; release_name: string | null },
>({
  item,
  onRemoveItem,
}: {
  item: T;
  onRemoveItem: ({
    id,
    event,
  }: {
    id: number;
    event: MouseEvent<HTMLButtonElement>;
  }) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });
  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className='flex items-center justify-between'>
      <div
        ref={setNodeRef}
        style={styles}
        className='hover:cursor-grab active:cursor-grabbing'
        {...attributes}
        {...listeners}>
        <p>{item.release_name || item.title}</p>
      </div>
      <button
        type='button'
        className='duration-300 cursor-pointer hover:bg-border p-1 rounded'
        onClick={(event) => onRemoveItem({ id: item.id, event })}>
        <X size={16} strokeWidth={1.25} />
      </button>
    </div>
  );
};

export default SortableItem;
