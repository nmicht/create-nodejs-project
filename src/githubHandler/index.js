const utils = require('../utils');

/**
 * Create a github repository
 * @param  {String}  name               The name for the github project
 * @param  {Boolean} [isPrivate=false]  Defines is the project will be created as private
 * or public on github
 * @param  {String} [description='']    The description for the github project
 * @param  {String} [url='']            The url for the github project
 * @param  {String} [user='']           The github user
 * @return {json|Boolean}               In case of success will return the json from the
 * github api response, otherwise, return false.
 * @throws {Error}                      If the token is not present
 */
async function create({
  name,
  isPrivate = false,
  description = '',
  url = '',
  github = {
    user: '',
    token: '',
  },
}) {
  let data;

  if (!github.token) {
    throw new Error('Token missing');
  }

  console.info('Creating github repository ...');
  const project = {
    name,
    private: isPrivate,
    description,
    homepage: url,
  };

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${github.token}`,
    'User-Agent': github.user,
  };

  try {
    data = await utils.requests.postReq(project, 'https://api.github.com/user/repos', headers);
    console.log(`Repository ${data.name} created`);
  } catch (e) {
    console.error('Repository not created: ', e.statusCode, e.data);
  }

  return data;
}

/**
 * Delete a github repository
 * @param  {String} name    The name of the repository
 * @param  {String} user    The owner of the repository
 * @param  {String} token   The github token for the user
 * @return {json|Boolean}   In case of success will return the json from the
 * github api response, otherwise, return false.
 * @throws If the token is not present
 */
async function deleteRepo(name, user, token) {
  let data;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
    'User-Agent': user,
  };

  if (!token) {
    throw new Error('Token missing');
  }


  console.info('Deleting github repository ...');
  try {
    data = await utils.requests.deleteReq(null, `https://api.github.com/repos/${user}/${name}`, headers);
    console.log(`Repository ${name} deleted`);
  } catch (e) {
    console.error('Repository not deleted: ', e.statusCode, e.data);
  }

  return data;
}

// TODO include a method to handle the topics (will require to get the github user)

module.exports = {
  create,
  deleteRepo,
};
