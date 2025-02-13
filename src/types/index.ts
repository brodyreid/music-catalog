import { Enums, Tables } from './database.types.ts';

export type Project = Tables<'projects'> & { position?: number };

export type Contributor = Tables<'contributors'>;

export type Album = Tables<'albums'>;

export type AlbumWithProjects = Album & { projects: Project[] };

export type ProjectWithAll = Project & {
  contributors: Contributor[];
  album: Album | null;
};

export type MusicalKey = Enums<'musical_key'>;
