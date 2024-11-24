import { Project, ProjectActions } from '../types.ts';

export interface ProjectState {
  selectedProject: Project | null;
  release_name: string | null;
  notes: string | null;
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

    case 'updated_release_name': {
      return {
        ...state,
        release_name: action.release_name || null
      };
    }

    case 'updated_notes': {
      return {
        ...state,
        notes: action.notes || null
      };
    }
  }
};