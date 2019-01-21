const fs = require('fs');

const settings = require('../settings');
const utils = require('../utils');

/**
 * Return the first user on the auth data
 * @param  {String} [jsonPath=settings.authPath] The path for the create-nodejs-project.json file
 * @return {Object|undefined}
 */
function firstUser(jsonPath = settings.authPath) {
  const auth = utils.fs.readJsonFile(jsonPath); // FIXME bubble the error

  return auth.github[0];
}

/**
 * Find a user on the auth file
 * @param  {String} user                         The user to find
 * @param  {String} [jsonPath=settings.authPath] The path for the create-nodejs-project.json file
 * @return {Object|undefined}
 */
function findUser(user, jsonPath = settings.authPath) {
  const auth = utils.fs.readJsonFile(jsonPath); // FIXME bubble the error

  return auth.github.find(obj => obj.user === user);
}

/**
 * Get the Github token from the auth file
 * @param  {String} user                         The user owner of the token
 * @param  {String} [jsonPath=settings.authPath] The path for the create-nodejs-project.json file
 * @return {String}                              The github token or empty string.
 */
function getToken(user, jsonPath = settings.authPath) {
  let userData;

  if (user) {
    userData = findUser(user, jsonPath);
  } else {
    userData = firstUser();
  }

  const { token } = userData || '';

  return token;
}

/**
 * Update the Token
 * @param  {String} user                            The user owner of the token
 * @param  {String} token                           The token
 * @param  {String} [jsonPath=settings.authPath]    The path for the create-nodejs-project.json file
 * @return {Boolean}                                True in case the file gets updated
 */
function updateToken(user, token, jsonPath = settings.authPath) {
  let auth = {};
  let currentToken = '';
  let userIndex;
  const authPath = utils.fs.resolvePath(jsonPath);

  auth = utils.fs.readJsonFile(jsonPath); // FIXME buble the error

  currentToken = firstUser().token;

  if (user) {
    userIndex = auth.github.findIndex(elem => elem.user === user);
    currentToken = auth.github[userIndex].token;
  }

  if (currentToken === token) {
    return false;
  }

  auth.github[userIndex].token = token;
  fs.writeFileSync(authPath, JSON.stringify(auth));

  return true;
}

module.exports = {
  firstUser,
  findUser,
  getToken,
  updateToken,
};
