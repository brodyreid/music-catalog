export interface AlbumState {
  title: string | null;
  notes: string | null;
  release_date: string | null;
}

export type AlbumActions =
  | { type: 'changed_title'; title: string; }
  | { type: 'changed_notes'; notes: string; }
  | { type: 'changed_release_date'; release_date: string; };

export function albumReducer(state: AlbumState, action: AlbumActions): AlbumState {
  switch (action.type) {
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