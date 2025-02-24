export enum MusicalKey {
  C_Major = 'C Major',
  C_Minor = 'C Minor',
  CSharp_Major = 'C# Major',
  CSharp_Minor = 'C# Minor',
  D_Major = 'D Major',
  D_Minor = 'D Minor',
  DSharp_Major = 'D# Major',
  DSharp_Minor = 'D# Minor',
  E_Major = 'E Major',
  E_Minor = 'E Minor',
  F_Major = 'F Major',
  F_Minor = 'F Minor',
  FSharp_Major = 'F# Major',
  FSharp_Minor = 'F# Minor',
  G_Major = 'G Major',
  G_Minor = 'G Minor',
  GSharp_Major = 'G# Major',
  GSharp_Minor = 'G# Minor',
  A_Major = 'A Major',
  A_Minor = 'A Minor',
  ASharp_Major = 'A# Major',
  ASharp_Minor = 'A# Minor',
  B_Major = 'B Major',
  B_Minor = 'B Minor',
}

export interface Project {
  id: number;
  title: string;
  bpm: number | null;
  date_created: string | null;
  folder_path_hash: string;
  musical_key: MusicalKey | null;
  notes: string | null;
  path: string | null;
  release_name: string | null;
}

export interface Album {
  id: number;
  title: string;
  notes: string | null;
  release_date: string | null;
}

export interface Contributor {
  id: number;
  artist_name: string;
  first_name: string | null;
}

export interface ProjectWithAll extends Project {
  contributors: Contributor[];
  album: Album | null;
}
