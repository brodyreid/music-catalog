import { Contributor } from '../types.ts';

export interface ContributorState {
  selectedContributor: Contributor | null;
}

export type ContributorActions =
  { type: 'set_selected_contributor'; contributor: Contributor | null; };

export function contributorReducer(state: ContributorState, action: ContributorActions) {
  switch (action.type) {
    case 'set_selected_contributor': {
      return {
        ...state,
        selectedContributor: action.contributor
      };
    }
  }
};