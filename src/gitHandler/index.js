const utils = require('../utils');

/**
 * Get the git user property from the git configuration
 * @param  {String} prop The property requested, ex. name
 * @return {String}      The git config value for the user
 */
async function userValue(prop) {
  let data = '';

  try {
    data = await utils.process.execp(`git config user.${prop}`);
  } catch (error) {
    console.error(error);
  }

  return data.trim();
}

/**
 * Initialize a git repository on the given path
 * @param  {String} [path='.'] The path for the git project
 * @return {String}            The result of the git init command
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
 * @param  {String} [path='.']    The path for the git project
 * @param  {String} [msg='Initial commit']      The commit message
 * @return {String}               The result of the git commit command
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
 * @param {String} [path='.']        The path for the git project
 * @param {[type]} url               The remote url
 * @param {String} [remote='origin'] The name for the remote
 * @return {String}                  The result of the git command
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
 * @param  {String} [path='.']        The path for the git project
 * @param  {String} [remote='origin'] The remote to push
 * @param  {String} [branch='master'] The branch pushed
 * @return {String}                   Tne result of the git push command
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

module.exports = {
  userValue,
  init,
  commit,
  addRemote,
  push,
};
