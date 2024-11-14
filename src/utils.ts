export const formatDate = (dateString: string | undefined) => {
  if (!dateString) { return; }

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};