import { Contributor } from '../types.ts';

export interface ContributorState {
  current: Contributor | null;
  first_name: string | null;
  artist_name: string | null;
}

export type ContributorActions =
  | { type: 'set_current_contributor'; contributor: Contributor | null; }
  | { type: 'changed_first_name'; first_name: string | null; }
  | { type: 'changed_artist_name'; artist_name: string | null; };

export function contributorReducer(state: ContributorState, action: ContributorActions) {
  switch (action.type) {
    case 'set_current_contributor': {
      return {
        ...state,
        current: action.contributor
      };
    }

    case 'changed_first_name': {
      return {
        ...state,
        first_name: action.first_name
      };
    }

    case 'changed_artist_name': {
      return {
        ...state,
        artist_name: action.artist_name
      };
    }
  }
};