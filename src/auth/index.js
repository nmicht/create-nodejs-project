const settings = require('../settings');
const utils = require('../utils');

/**
 * Return the first user on the auth data
 * @return {Object|undefined}
 */
async function firstUser() {
  const auth = settings.auth.github;

  return auth[0];
}

/**
 * Find a user on the auth file
 * @param  {String} user                         The user to find
 * @return {Object|undefined}
 */
async function findUser(user) {
  const auth = settings.auth.github;

  return auth.find(obj => obj.user === user);
}

/**
 * Get the Github token from the auth file
 * @param  {String} user                         The user owner of the token
 * @return {String|undefined}                    The github token or undefined if there is no token.
 */
async function getToken(user) {
  let userData;

  if (user) {
    userData = await findUser(user);
  } else {
    userData = await firstUser();
  }

  const token = userData ? userData.token : undefined;

  return token;
}

/**
 * Update the auth data file
 * @param  {String} user                            The user owner of the token
 * @param  {String} token                           The token
 * @return {Boolean}                                True in case the file gets updated
 */
async function updateToken(user, token) {
  let currentToken = '';
  let userIndex;
  const auth = settings.auth.github;

  currentToken = firstUser().token;

  if (user) {
    // TODO consider the case for a new user data
    userIndex = auth.findIndex(elem => elem.user === user);
    currentToken = auth[userIndex].token;
  }

  if (currentToken === token) {
    return false;
  }

  auth[userIndex].token = token;
  settings.writeFile();

  return true;
}

module.exports = {
  firstUser,
  findUser,
  getToken,
  updateToken,
};
