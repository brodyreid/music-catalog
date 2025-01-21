import { AlbumActions, AlbumState } from '@/reducers/albumReducer.ts';
import { Dispatch } from 'react';

interface AlbumProjectsProps {
  state: AlbumState;
  dispatch: Dispatch<AlbumActions>;
  onUpdate: (state: AlbumState) => void;
}

export default function AlbumProjects({ state }: AlbumProjectsProps) {
  // const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  // const [searchedProjects, setSearchedProjects] = useState<Project[]>([]);
  // const { data } = useFetchData<Project>('http://localhost:3000/projects');

  console.log(state.current);
  return (
    <div>
      <p>tracks:</p>
      <ol>
        {state.current?.projects.map(p => <li key={p.id}>{p.release_name || p.title || 'no title'}</li>)}
      </ol>
    </div>
  );
}