import { AlbumWithProjects, CreateStateType, Project, ReducerActions } from '@/types.ts';

export type AlbumState = CreateStateType<AlbumWithProjects>;

export type AlbumActions = ReducerActions<AlbumWithProjects>
  | { type: 'changed_title'; title: string; }
  | { type: 'changed_notes'; notes: string; }
  | { type: 'changed_release_date'; release_date: string; }
  | { type: 'added_project'; project: Project; }
  | { type: 'removed_project'; projectId: string; };

export const initialState = {
  all: [],
  current: null,
  title: null,
  notes: null,
  release_date: null,
  projects: []
};

export function albumReducer(state: AlbumState, action: AlbumActions): AlbumState {
  switch (action.type) {
    case 'set_all': {
      return {
        ...state,
        all: action.all
      };
    }

    case 'set_current': {
      return {
        ...state,
        current: action.current,
        title: action.current?.title ?? '',
        notes: action.current?.notes ?? '',
        release_date: action.current?.release_date ?? ''
      };
    }

    case 'changed_title': {
      return {
        ...state,
        title: action.title
      };
    }

    case 'changed_notes': {
      return {
        ...state,
        notes: action.notes
      };
    }

    case 'changed_release_date': {
      return {
        ...state,
        release_date: action.release_date
      };
    }

    case 'added_project': {
      return {
        ...state,
        projects: [...state.projects, action.project]
      };
    }

    case 'removed_project': {
      return {
        ...state,
        projects: [...state.projects.filter(p => p.id !== action.projectId)]
      };
    }
  }
};