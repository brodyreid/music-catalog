import { Contributor, Project, ProjectActions } from '../types.ts';

export interface ProjectState {
  selectedProject: Project | null;
  release_name: string | null;
  notes: string | null;
  contributors: Contributor[] | [];
}

export function projectReducer(state: ProjectState, action: ProjectActions) {
  switch (action.type) {
    case 'set_selected_project': {
      return {
        ...state,
        selectedProject: action.project,
        release_name: action.project?.release_name ?? null,
        notes: action.project?.notes ?? null
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
      
    case 'added_contributor': {
      return {
        ...state,
        contributors: [...state.contributors, action.contributor]
      }
    }
  }
};