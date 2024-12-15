import { Contributor } from '@/types.ts';

export interface ContributorState {
  current: Contributor | null;
  first_name: string;
  artist_name: string;
}

export type ContributorActions =
  | { type: 'set_current_contributor'; contributor: Contributor | null; }
  | { type: 'changed_first_name'; first_name: string; }
  | { type: 'changed_artist_name'; artist_name: string; };

export function contributorReducer(state: ContributorState, action: ContributorActions): ContributorState {
  switch (action.type) {
    case 'set_current_contributor': {
      return {
        current: action.contributor,
        first_name: action.contributor?.first_name ?? '',
        artist_name: action.contributor?.artist_name ?? ''
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