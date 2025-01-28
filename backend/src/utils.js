import { createHash } from 'crypto';

export const createDeterministicId = (projectName) => {
  return createHash('sha256').update(projectName).digest('hex').slice(0, 16);
};

export const serverError = (res, error) => {
  console.error(error);
  res.status(500).send('Server error');
};
