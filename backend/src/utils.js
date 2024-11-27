const crypto = require('crypto');

const createDeterministicId = (projectName) => {
  return crypto.createHash('sha256').update(projectName).digest('hex').slice(0, 16);
};

const serverError = (res, error) => {
  console.error(error);
  res.status(500).send('Server error');
};

module.exports = { createDeterministicId, serverError };