export interface Project {
  id: number;
  title?: string;
  folder_path?: string;
  notes?: string;
  date_created?: string;
}

export interface ProjectContributor extends Project {
  contributors: string[];
}
