import { Contributor, CreateStateType, MusicalKey, ProjectWithContributors, ReducerActions } from '@/types/index.ts';

export type ProjectState = Omit<CreateStateType<ProjectWithContributors>, 'title' | 'folder_path' | 'date_created'>;

export type ProjectActions =
  | ReducerActions<ProjectWithContributors>
  | { type: 'changed_release_name'; release_name: string }
  | { type: 'changed_notes'; notes: string }
  | { type: 'changed_bpm'; bpm: number }
  | { type: 'changed_musical_key'; musical_key: MusicalKey }
  | { type: 'added_contributor'; contributor: Contributor }
  | { type: 'removed_contributor'; contributorId: string };

export const initialState = {
  all: [],
  current: null,
  release_name: null,
  notes: null,
  bpm: null,
  musical_key: null,
  contributors: [],
};

export function projectReducer(state: ProjectState, action: ProjectActions): ProjectState {
  switch (action.type) {
    case 'set_all': {
      return {
        ...state,
        all: action.all,
      };
    }

    case 'set_current': {
      return {
        ...state,
        current: action.current,
        release_name: action.current?.release_name ?? null,
        notes: action.current?.notes ?? null,
        bpm: action.current?.bpm ?? null,
        musical_key: action.current?.musical_key ?? null,
        contributors: action.current?.contributors ?? [],
      };
    }

    case 'changed_release_name': {
      return {
        ...state,
        release_name: action.release_name || null,
      };
    }

    case 'changed_notes': {
      return {
        ...state,
        notes: action.notes || null,
      };
    }

    case 'changed_bpm': {
      return {
        ...state,
        bpm: action.bpm || null,
      };
    }

    case 'changed_musical_key': {
      return {
        ...state,
        musical_key: action.musical_key || null,
      };
    }

    case 'added_contributor': {
      return {
        ...state,
        contributors: [...state.contributors, action.contributor],
      };
    }

    case 'removed_contributor': {
      return {
        ...state,
        contributors: [...state.contributors.filter((c) => c.id !== action.contributorId)],
      };
    }
  }
}
