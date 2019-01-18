const fs = require('fs');

const settings = require('../settings');
const utils = require('../utils');

/**
 * Get the Github token from the auth file
 * @param  {String} [user=undefined] The user owner of the token
 * @param  {String} [path='']        The path for the auth.json file
 * @return {String}                  The github token
 */
function getToken(user = undefined, jsonPath = '') {
  let auth = {};
  const authPath = jsonPath || settings.authPath;
  const authFile = utils.resolvePath(authPath);

  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  let { token } = auth.github[0];

  if (user) {
    token = auth.github.filter(obj => obj.user === user)[0].token;
  }

  if (!token) {
    throw new Error('Token missing');
  }

  return token;
}

/**
 * Update the Token
 * @param  {String} [user=undefined] The user owner of the token
 * @param  {String} token            The token
 * @param  {String} [jsonPath='']    The path for the auth.json file
 * @return {Boolean}                 True in case the file gets updated
 */
function updateToken(user = undefined, token, jsonPath = '') {
  let auth = {};
  let currentToken = '';
  let userIndex = 0;
  const authPath = jsonPath || settings.authPath;
  const authFile = utils.resolvePath(authPath);

  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  currentToken = auth.github[0].token;

  if (user) {
    for (let k = 0; k < auth.github.length; k += 1) {
      if (auth.github[k].user === user) {
        userIndex = k;
        currentToken = auth.github[k].token;
        break;
      }
    }
  }

  if (currentToken !== token) {
    auth.github[userIndex].token = token;
    fs.writeFileSync(authFile, JSON.stringify(auth));
    return true;
  }

  return false;
}

/**
 * Get the first user from the auth file
 * @param  {String} [jsonPath=''] The auth.json file path
 * @return {String}               The user
 */
function getFirstUser(jsonPath = '') {
  let auth = {};
  const authPath = jsonPath || settings.authPath;
  const authFile = utils.resolvePath(authPath);

  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  return auth.github[0].user;
}

module.exports = {
  getToken,
  updateToken,
  getFirstUser,
};
