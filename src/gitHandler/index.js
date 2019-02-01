const utils = require('../utils');

/**
 * Get the git user property from the git configuration
 * @method userValue
 * @param  {String} prop      The property requested, ex. name
 * @return {String|undefined} The git config value for the user
 */
async function userValue(prop) {
  let data;

  try {
    data = (await utils.process.execp(`git config user.${prop}`)).trim();
  } catch (error) {
    console.error(error);
  }

  return data;
}

/**
 * Initialize a git repository on the given path
 * @method init
 * @param  {String} [path='.'] The path for the git project
 * @return {String}            The result of the git init command or empty in case of error
 */
async function init(path = '.') {
  let resp = '';

  try {
    resp = await utils.process.execp('git init', path);
  } catch (error) {
    console.error(error);
  }

  return resp;
}

/**
 * Add all and commit
 * @method commit
 * @param  {String} [path='.']              The path for the git project
 * @param  {String} [msg='Initial commit']  The commit message
 * @return {String}                         The result of the git commit command
 * or empty in case of error
 */
async function commit(path = '.', msg = 'Initial commit') {
  let resp = '';

  try {
    resp = await utils.process.execp(`git add . && git commit -m'${msg}'`, path);
  } catch (error) {
    console.error(error);
  }

  return resp;
}

/**
 * Add a remote to a git project
 * @method addRemote
 * @param {String} [path='.']        The path for the git project
 * @param {String} url               The remote url
 * @param {String} [remote='origin'] The name for the remote
 * @return {String}                  The result of the git command or empty in case of error
 */
async function addRemote(path = '.', url, remote = 'origin') {
  let resp = '';

  try {
    resp = await utils.process.execp(`git remote add ${remote} ${url}`, path);
  } catch (error) {
    console.error(error);
  }

  return resp;
}

/**
 * Push from local to a remote
 * @method push
 * @param  {String} [path='.']        The path for the git project
 * @param  {String} [remote='origin'] The remote to push
 * @param  {String} [branch='master'] The branch pushed
 * @return {String}                   Tne result of the git push command or empty in case of error
 */
async function push(path = '.', remote = 'origin', branch = 'master') {
  let resp = '';

  try {
    resp = await utils.process.execp(`git push ${remote} ${branch}`, path);
  } catch (error) {
    console.error(error);
  }

  return resp;
}

/**
 * A git handler
 * @module gitHandler
 */
module.exports = {
  userValue,
  init,
  commit,
  addRemote,
  push,
};
