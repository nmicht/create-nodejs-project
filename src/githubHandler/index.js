const utils = require('../utils');
const auth = require('../auth');

/**
 * Create a github repository
 * @param  {String}  name               The name for the github project
 * @param  {Boolean} [isPrivate=false]  Defines is the project will be created as private
 * or public on github
 * @param  {String} [description='']    The description for the github project
 * @param  {String} [url='']            The url for the github project
 * @param  {String} [user='']           The github user
 * @return {json|Boolean}   In case of success will return the json from the
 * github api response, otherwise, return false.
 * @throws If the token is not present
 */
async function create({
  name,
  isPrivate = false,
  description = '',
  url = '',
  user = '',
}) {
  const token = await auth.getToken(user);
  let result;

  if (!token) {
    throw new Error('Token missing');
  }

  try {
    console.info('Creating github repository ...');
    // TODO consider use http instead curl?
    const cmd = `curl -w "%{http_code}" -H "Authorization: token ${token}" -d '{"name": "${name}", "private": ${isPrivate}, "description": "${description}", "homepage": "${url}"}' https://api.github.com/user/repos`;

    result = await utils.process.execp(cmd);

    let json = result.substring(0, result.lastIndexOf('\n'));
    const statusCode = Number(result.substring(result.lastIndexOf('\n')));

    json = JSON.parse(json);

    if (statusCode !== 201) {
      console.error('Repository not created: ', json.errors[0].message);
      return false;
    }

    console.log(`Repository ${json.name} created`);
    return json;
  } catch (error) {
    throw error;
  }
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
  const token = await auth.getToken(user);
  let result;

  if (!token) {
    throw new Error('Token missing');
  }

  try {
    console.info('Deleting github repository ...');
    // TODO consider use http instead curl?
    const cmd = `curl -w "%{http_code}" -XDELETE -H "Authorization: token ${token}" https://api.github.com/repos/${user}/${name}`;

    result = await utils.process.execp(cmd);

    const statusCode = Number(result.substring(result.lastIndexOf('\n')));

    if (statusCode !== 204) {
      let json = result.substring(0, result.lastIndexOf('\n'));

      json = JSON.parse(json);

      console.error('Repository not deleted: ', json.message);
      return false;
    }

    console.log(`Repository ${name} deleted`);

    return {
      message: 'Repository deleted',
      statusCode,
    };
  } catch (error) {
    throw error;
  }
}

// TODO include a method to handle the topics (will require to get the github user)

module.exports = {
  create,
  deleteRepo,
};
