const utils = require('../utils');
const auth = require('../auth');

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
    token = await auth.getToken();
  } catch (error) {
    throw error;
  }

  console.log('Creating github repository...\n');
  // TODO consider use http instead curl?
  // TODO Include description, website and keywords
  const cmd = `curl -w "%{http_code}" -H "Authorization: token ${token}" -d '{"name": "${name}", "private": ${isPrivate}}' https://api.github.com/user/repos`;

  try {
    result = await utils.execp(cmd);
  } catch (error) {
    console.error(error);
    return false;
  }

  let json = result.substring(0, result.lastIndexOf('\n'));
  const statusCode = Number(result.substring(result.lastIndexOf('\n')));

  try {
    json = JSON.parse(json);
  } catch (error) {
    return false;
  }

  if (statusCode !== 201) {
    console.error('Repository not created: ', json.errors[0].message);
    return false;
  }

  console.log(`Repository ${json.name} created`);
  return json;
}

/**
 * Delete a github repository
 * @param  {String} name The name of the repository
 * @param  {String} user The owner of the repository
 * @return {json|Boolean}   In case of success will return the json from the
 * github api response, otherwise, return false.
 * @throws If the token is not present
 */
async function deleteRepo(name, user) {
  let token = '';
  let result;

  try {
    token = await auth.getToken();
  } catch (error) {
    throw error;
  }

  console.log('Deleting github repository...\n');
  // TODO consider use http instead curl?
  const cmd = `curl -w "%{http_code}" -XDELETE -H "Authorization: token ${token}" https://api.github.com/repos/${user}/${name}`;

  try {
    result = await utils.execp(cmd);
  } catch (error) {
    console.error(error);
    return false;
  }

  const statusCode = Number(result.substring(result.lastIndexOf('\n')));

  if (statusCode !== 204) {
    let json = result.substring(0, result.lastIndexOf('\n'));
    try {
      json = JSON.parse(json);
    } catch (error) {
      return false;
    }
    console.error('Repository not deleted: ', json.message);
    return false;
  }

  console.log(`Repository ${name} deleted`);

  return {
    message: 'Repository deleted',
    statusCode,
  };
}

module.exports = {
  create,
  deleteRepo,
};
