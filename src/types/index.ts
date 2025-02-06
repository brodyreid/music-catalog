import { Database } from './database.types.ts';

export interface ReducerState<T> {
  all: T[] | [];
  current: T | null;
}

export type ReducerActions<T> = { type: 'set_all'; all: T[] | [] } | { type: 'set_current'; current: T | null };

export type CreateStateType<T> = ReducerState<T> & Omit<T, 'id'>;

export type SaveDataResponse<T> = { message: string } & { data: T };

export type Project = Database['public']['Tables']['projects']['Row'];
export type Contributor = Database['public']['Tables']['contributors']['Row'];
export type Album = Database['public']['Tables']['albums']['Row'];
export type ProjectWithAll = Project & { contributors: Contributor[]; albums: Album[]; };
export type AlbumWithProjects = Album & { projects: Project[] };

export type SortOptions = 'asc' | 'desc' | null;

export enum MusicalKey {
  C_MAJOR = 'C Major',
  C_MINOR = 'C Minor',
  C_SHARP_MAJOR = 'C# Major',
  C_SHARP_MINOR = 'C# Minor',
  D_MAJOR = 'D Major',
  D_MINOR = 'D Minor',
  D_SHARP_MAJOR = 'D# Major',
  D_SHARP_MINOR = 'D# Minor',
  E_MAJOR = 'E Major',
  E_MINOR = 'E Minor',
  F_MAJOR = 'F Major',
  F_MINOR = 'F Minor',
  F_SHARP_MAJOR = 'F# Major',
  F_SHARP_MINOR = 'F# Minor',
  G_MAJOR = 'G Major',
  G_MINOR = 'G Minor',
  G_SHARP_MAJOR = 'G# Major',
  G_SHARP_MINOR = 'G# Minor',
  A_MAJOR = 'A Major',
  A_MINOR = 'A Minor',
  A_SHARP_MAJOR = 'A# Major',
  A_SHARP_MINOR = 'A# Minor',
  B_MAJOR = 'B Major',
  B_MINOR = 'B Minor',
}
