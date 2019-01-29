const fs = require('fs').promises;

const settings = require('../settings');
const utils = require('../utils');

/**
 * Get the auth file contents converted to json
 * @param  {String} [jsonPath=settings.authPath] The path for the create-nodejs-project.json file
 * @return {Promise}
 */
function getFileData(jsonPath = settings.authPath) {
  return utils.files.readJsonFile(jsonPath);
}

/**
 * Return the first user on the auth data
 * @param  {String} [jsonPath=settings.authPath] The path for the create-nodejs-project.json file
 * @return {Object|undefined}
 */
async function firstUser(jsonPath = settings.authPath) {
  const auth = await getFileData(jsonPath);

  return auth.github[0];
}

/**
 * Find a user on the auth file
 * @param  {String} user                         The user to find
 * @param  {String} [jsonPath=settings.authPath] The path for the create-nodejs-project.json file
 * @return {Object|undefined}
 */
async function findUser(user, jsonPath = settings.authPath) {
  const auth = await getFileData(jsonPath);

  return auth.github.find(obj => obj.user === user);
}

/**
 * Get the Github token from the auth file
 * @param  {String} user                         The user owner of the token
 * @param  {String} [jsonPath=settings.authPath] The path for the create-nodejs-project.json file
 * @return {String|undefined}                    The github token or undefined if there is no token.
 */
async function getToken(user, jsonPath = settings.authPath) {
  let userData;

  if (user) {
    userData = await findUser(user, jsonPath);
  } else {
    userData = await firstUser();
  }

  const token = userData ? userData.token : undefined;

  return token;
}

/**
 * Write the auth data json in the file
 * @param  {Object} data                         The object/json data
 * @param  {String} [jsonPath=settings.authPath] The path
 * @return {Promise}
 */
function writeAuthFile(data, jsonPath = settings.authPath) {
  const authPath = utils.files.resolvePath(jsonPath);
  const json = JSON.stringify(data, null, 2);
  return fs.writeFile(authPath, json);
}

/**
 * Update the auth data file
 * @param  {String} user                            The user owner of the token
 * @param  {String} token                           The token
 * @param  {String} [jsonPath=settings.authPath]    The path for the create-nodejs-project.json file
 * @return {Boolean}                                True in case the file gets updated
 */
async function updateAuthFile(user, token, jsonPath = settings.authPath) {
  let currentToken = '';
  let userIndex;
  const authPath = utils.files.resolvePath(jsonPath);
  const auth = await getFileData(jsonPath);

  currentToken = firstUser().token;

  if (user) {
    // TODO consider the case for a new user data
    userIndex = auth.github.findIndex(elem => elem.user === user);
    currentToken = auth.github[userIndex].token;
  }

  if (currentToken === token) {
    return false;
  }

  auth.github[userIndex].token = token;
  writeAuthFile(auth, authPath);

  return true;
}

module.exports = {
  getFileData,
  firstUser,
  findUser,
  getToken,
  updateAuthFile,
  writeAuthFile,
};
