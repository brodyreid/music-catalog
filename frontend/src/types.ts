export interface Project {
  id: string;
  title: string;
  release_name: string | null;
  folder_path: string;
  notes: string | null;
  date_created: string | null;
  contributors: Contributor[] | null;
  versions: {
    id: string;
    name: string;
  }[] | null;
}

export interface Contributor {
  id: string;
  first_name: string | null;
  artist_name: string | null;
}

export type SortOptions = 'asc' | 'desc' | null;