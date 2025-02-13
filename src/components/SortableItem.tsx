import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = <T extends { id: number; title: string }>({ item }: { item: T }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });
  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={styles} {...attributes} {...listeners}>
      {item.title}
    </div>
  );
};

export default SortableItem;
