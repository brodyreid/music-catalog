import { Album } from '../types.ts';

export interface AlbumState {
  selectedAlbum: Album | null;
}

export type AlbumActions =
  { type: 'set_selected_album'; album: Album | null; };

export function albumReducer(state: AlbumState, action: AlbumActions) {
  switch (action.type) {
    case 'set_selected_album': {
      return {
        ...state,
        selectedAlbum: action.album
      };
    }
  }
};