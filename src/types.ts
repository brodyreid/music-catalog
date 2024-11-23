export interface Project {
  id: string;
  title: string;
  release_name?: string;
  folder_path: string;
  notes?: string;
  date_created?: string;
  contributors: {
    id: string;
    name: string;
  }[];
  versions: {
    id: string;
    name: string;
  }[];
}

export type SortOptions = 'asc' | 'desc' | null;