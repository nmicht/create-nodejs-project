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
  let ghData;
  const authPath = jsonPath || settings.authPath;
  const authFile = utils.fs.resolvePath(authPath);

  // FIXME: estructura repetitiva. getAuthConfig()?
  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  if (user) {
    // FIXME: si no encuentra objetos ghData será undefined
    [ghData] = auth.github.filter(obj => obj.user === user);
  } else {
    [ghData] = auth.github;
  }

  const { token } = ghData;

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
// FIXME: los valores no especificados son undefined
function updateToken(user = undefined, token, jsonPath = '') {
  let auth = {};
  let currentToken = '';
  let userIndex = 0;
  // Qué valores por puede tener jsonPath; podría setearse como valor por default jsonPath = settings.authPath
  const authPath = jsonPath || settings.authPath;
  const authFile = utils.fs.resolvePath(authPath);

  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  currentToken = auth.github[0].token;

  // FIXME: no se puede reemplazar por un find o separalo en otra función?
  if (user) {
    // FIXME: qué es `k`?
    // FIXME: reemplazar por findIndex?
    for (let k = 0; k < auth.github.length; k += 1) {
      if (auth.github[k].user === user) {
        userIndex = k;
        currentToken = auth.github[k].token;
        break;
      }
    }
  }

  // FIXME: tal vez se vería mejor si se invierte la validación
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
  // FIXME: podría setearse como valor por default jsonPath = settings.authPath
  const authPath = jsonPath || settings.authPath;
  const authFile = utils.fs.resolvePath(authPath);

  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  // FIMXE:
  // const [ firstUserData ] = auth.github;
  // retun firstUserData.user;

  return auth.github[0].user;
}

module.exports = {
  getToken,
  updateToken,
  getFirstUser,
};
