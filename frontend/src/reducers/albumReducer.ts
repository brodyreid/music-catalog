import { Album, CreateStateType, ReducerActions } from '@/types.ts';

export type AlbumState = CreateStateType<Album>;

export type AlbumActions = ReducerActions<Album>
  | { type: 'changed_title'; title: string; }
  | { type: 'changed_notes'; notes: string; }
  | { type: 'changed_release_date'; release_date: string; };

export const initialState = {
  all: [],
  current: null,
  title: '',
  notes: '',
  release_date: ''
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
  }
};