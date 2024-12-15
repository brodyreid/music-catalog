import { Album } from '@/types.ts';

export interface AlbumState {
  current: Album | null;
  title: string;
  notes: string;
  release_date: string;
}

export type AlbumActions =
  | { type: 'set_current_album'; album: Album | null; }
  | { type: 'changed_title'; title: string; }
  | { type: 'changed_notes'; notes: string; }
  | { type: 'changed_release_date'; release_date: string; };

export function albumReducer(state: AlbumState, action: AlbumActions): AlbumState {
  switch (action.type) {
    case 'set_current_album': {
      return {
        current: action.album,
        title: action.album?.title ?? '',
        notes: action.album?.notes ?? '',
        release_date: action.album?.release_date ?? ''
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