export interface Project {
  id: string;
  title: string;
  release_name?: string;
  folder_path: string;
  notes?: string;
  date_created?: string;
}

export interface ProjectContributor extends Project {
  contributors: {
    id: string;
    name: string;
  }[];
}

export interface ProjectFull extends ProjectContributor {
  versions: {
    id: string;
    name: string;
  }[];
}

export type SortOptions = 'asc' | 'desc' | null;