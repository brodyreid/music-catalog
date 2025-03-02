import { useQuery } from '@tanstack/react-query';
import { MusicalKey } from './types/index.ts';

export const MUSICAL_KEYS = [
  'C Major',
  'C Minor',
  'C# Major',
  'C# Minor',
  'D Major',
  'D Minor',
  'D# Major',
  'D# Minor',
  'E Major',
  'E Minor',
  'F Major',
  'F Minor',
  'F# Major',
  'F# Minor',
  'G Major',
  'G Minor',
  'G# Major',
  'G# Minor',
  'A Major',
  'A Minor',
  'A# Major',
  'A# Minor',
  'B Major',
  'B Minor',
] as const satisfies MusicalKey[];

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

// Deprecated
export const generateId = () => {
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);

  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
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
