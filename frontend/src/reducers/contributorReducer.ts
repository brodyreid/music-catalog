import { Contributor } from '../types.ts';

export interface ContributorState {
  selectedContributor: Contributor | null;
  firstName: string | null;
  artistName: string | null;
}

export type ContributorActions =
  { type: 'set_selected_contributor'; contributor: Contributor | null; }
  | { type: 'changed_first_name'; firstName: string; }
  | { type: 'changed_artist_name'; artistName: string; };

export function contributorReducer(state: ContributorState, action: ContributorActions) {
  switch (action.type) {
    case 'set_selected_contributor': {
      return {
        ...state,
        selectedContributor: action.contributor
      };
    }

    case 'changed_first_name': {
      return {
        ...state,
        firstName: action.firstName
      };
    }

    case 'changed_artist_name': {
      return {
        ...state,
        artistName: action.artistName
      };
    }
  }
};