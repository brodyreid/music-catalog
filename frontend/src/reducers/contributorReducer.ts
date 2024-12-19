import { Contributor, CreateStateType, ReducerActions } from '@/types.ts';

export type ContributorState = CreateStateType<Contributor>;

export type ContributorActions = ReducerActions<Contributor>
  | { type: 'changed_first_name'; first_name: string; }
  | { type: 'changed_artist_name'; artist_name: string; };

export const initialState = {
  all: [],
  current: null,
  first_name: null,
  artist_name: null
};

export function contributorReducer(state: ContributorState, action: ContributorActions): ContributorState {
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
        first_name: action.current?.first_name ?? '',
        artist_name: action.current?.artist_name ?? ''
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