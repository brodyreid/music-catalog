import { SaveDataResponse } from './types.ts';

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

export const saveData = async <TBody, TResponse>(url: string, body: Omit<TBody, 'id'>): Promise<SaveDataResponse<TResponse>> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), // "that's fine, right?" - alex
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const deleteData = async <T>(url: string): Promise<SaveDataResponse<T>> => {
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const generateId = () => {
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);

  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};
