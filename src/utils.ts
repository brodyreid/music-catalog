import { Store } from '@tauri-apps/plugin-store';
import { MusicalKey } from './types.ts';

export const musicalKeys: MusicalKey[] = [
  MusicalKey.C_Major,
  MusicalKey.C_Minor,
  MusicalKey.CSharp_Major,
  MusicalKey.CSharp_Minor,
  MusicalKey.D_Major,
  MusicalKey.D_Minor,
  MusicalKey.DSharp_Major,
  MusicalKey.DSharp_Minor,
  MusicalKey.E_Major,
  MusicalKey.E_Minor,
  MusicalKey.F_Major,
  MusicalKey.F_Minor,
  MusicalKey.FSharp_Major,
  MusicalKey.FSharp_Minor,
  MusicalKey.G_Major,
  MusicalKey.G_Minor,
  MusicalKey.GSharp_Major,
  MusicalKey.GSharp_Minor,
  MusicalKey.A_Major,
  MusicalKey.A_Minor,
  MusicalKey.ASharp_Major,
  MusicalKey.ASharp_Minor,
  MusicalKey.B_Major,
  MusicalKey.B_Minor,
];

export const formatReadableDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const formatNumericDate = (dateString: string | null) => {
  if (!dateString) {
    return '';
  }
  return new Date(dateString).toISOString().split('T')[0];
};

export const generateHash = async (key: string) => {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(key));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

export const convertEmptyStringsToNull = <T extends Record<string, unknown>>(obj: T) => {
  const result = { ...obj } as Record<string, unknown>;

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string' && value === '') {
      result[key] = null;
    }
  }

  return result as T;
};

export const apiError = (error: unknown) => {
  console.error(error);
  return { success: false, message: error };
};

export const setTheme = async (newTheme: 'light' | 'dark') => {
  const store = await Store.load('store.json');
  store.set('theme', newTheme);
};
