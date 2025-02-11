import { Enums, Tables } from './database.types.ts';

export interface ReducerState<T> {
  all: T[] | [];
  current: T | null;
}
export type ReducerActions<T> = { type: 'set_all'; all: T[] | [] } | { type: 'set_current'; current: T | null };
export type CreateStateType<T> = ReducerState<T> & Omit<T, 'id'>;
export type SaveDataResponse<T> = { message: string } & { data: T };

export type Project = Tables<'projects'>;
export type Contributor = Tables<'contributors'>;
export type Album = Tables<'albums'>;
export type ProjectWithAll = Project & { contributors: Contributor[]; album: Album | null };
export type AlbumWithProjects = Album & { projects: Project[] };

export type MusicalKey = Enums<'musical_key'>;

export type SortOptions = 'asc' | 'desc' | null;
