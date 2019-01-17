const fs = require('fs');
const path = require('path');

const settings = require('../settings');

/**
 * Get the Github token from the auth file
 * @param  {String} [path=''] The path for the auth.json file
 * @return {String} The github token
 * @throws If the file is not present or can be read as json
 */
async function getToken(jsonPath = '') {
  let auth = {};
  let authPath = jsonPath;
  if (!jsonPath) {
    authPath = settings.authPath;
  }
  const authFile = path.resolve(authPath);

  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  if (!auth.github.token) {
    throw new Error('Token missing');
  }

  return auth.github.token;
}

module.exports = {
  getToken,
};
