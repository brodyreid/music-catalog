import { Contributor, MusicalKey, Project } from '../types.ts';

export interface ProjectState {
  selectedProject: Project | null;
  release_name: string | null;
  notes: string | null;
  bpm: number | null;
  musical_key: MusicalKey | null;
  contributors: Contributor[] | [];
}

export type ProjectActions =
  { type: 'set_selected_project'; project: Project | null; }
  | { type: 'changed_release_name'; release_name: string; }
  | { type: 'changed_notes'; notes: string; }
  | { type: 'changed_bpm'; bpm: number; }
  | { type: 'changed_musical_key'; musical_key: MusicalKey; }
  | { type: 'added_contributor'; contributor: Contributor; }
  | { type: 'removed_contributor'; contributorId: string; };


export function projectReducer(state: ProjectState, action: ProjectActions) {
  switch (action.type) {
    case 'set_selected_project': {
      return {
        ...state,
        selectedProject: action.project,
        release_name: action.project?.release_name ?? null,
        notes: action.project?.notes ?? null,
        bpm: action.project?.bpm ?? null,
        musical_key: action.project?.musical_key ?? null,
        contributors: action.project?.contributors ?? []
      };
    }

    case 'changed_release_name': {
      return {
        ...state,
        release_name: action.release_name || null
      };
    }

    case 'changed_notes': {
      return {
        ...state,
        notes: action.notes || null
      };
    }

    case 'changed_bpm': {
      console.log({ action });
      return {
        ...state,
        bpm: action.bpm || null
      };
    }

    case 'changed_musical_key': {
      console.log({ action });
      return {
        ...state,
        musical_key: action.musical_key || null
      };
    }

    case 'added_contributor': {
      return {
        ...state,
        contributors: [...state.contributors, action.contributor]
      };
    }

    case 'removed_contributor': {
      return {
        ...state,
        contributors: [...state.contributors.filter(c => c.id !== action.contributorId)]
      };
    }
  }
};