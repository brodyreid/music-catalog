export interface Project {
  project_id: number;
  project_number?: number;
  title?: string;
  folder_path?: string;
  notes?: string;
  date_created?: string;
}

export interface ProjectCollab extends Project {
  person_id: number;
  name: string;
}
