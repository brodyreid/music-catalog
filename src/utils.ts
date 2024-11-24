export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

export const saveData = async<TBody>(url: string, body: TBody) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const generateId = () => {
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);

  return Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join('');
};
