const fs = require('fs');
const path = require('path');
const os = require('os');

const utils = require('../utils');

/**
 * Get the Github token from the auth file
 * @return {String} The github token
 * @throws If the file is not present or can be read as json
 */
async function getToken() {
  let auth = {};
  // TODO do not hardcode the path for auth.json file
  const authFile = path.resolve(path.join(os.homedir(), 'auth.json'));
  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  return auth.github.token;
}

/**
 * Create a github repository
 * @param  {String}  name   The name for the github project
 * @param  {Boolean} [isPrivate=false]  Defines is the project will be created as private
 * or public on github
 * @return {json|Boolean}   In case of success will return the json from the
 * github api response, otherwise, return false.
 * @throws If the token is not present
 */
async function create(name, isPrivate = false) {
  let token = '';
  let result;

  try {
    token = await getToken();
  } catch (error) {
    throw error;
  }

  console.log('Creating github repository...\n');
  // TODO consider use http instead curl?
  const cmd = `curl -w "%{http_code}" -H "Authorization: token ${token}" -d '{"name": "${name}", "private": ${isPrivate}}' https://api.github.com/user/repos`;

  try {
    result = await utils.execp(cmd);
  } catch (error) {
    console.error(error);
    return false;
  }

  let json = result.substring(0, result.lastIndexOf('\n'));
  const statusCode = result.substring(result.lastIndexOf('\n'));

  try {
    json = JSON.parse(json);
  } catch (error) {
    return false;
  }

  console.log(json);

  if (statusCode !== 201) {
    console.error('Repository not created: ', json.errors[0].message);
    return false;
  }

  return json;
}

module.exports = {
  create,
  getToken,
};
