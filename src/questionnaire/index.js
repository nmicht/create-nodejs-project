const questions = require('./questions');
const auth = require('../auth');

async function run(name) {
  const resp = await questions.getProjectDetails(name);

  // Process keywords
  resp.keywords = resp.keywords.split(',');

  if (!resp.useGithub) {
    Object.assign(resp, await questions.getGitRemoteDetails());
<<<<<<< HEAD
    resp.hasRemote = !!resp.git.url;
=======
    resp.hasRemote = resp.git.url ? true : false;
>>>>>>> a46b44e7ab2bc3a651d4d84a6257861980f80567
  } else {
    Object.assign(resp, await questions.getAuthFile());
    const token = await auth.getToken(resp.authPath);
    Object.assign(resp, await questions.getAuthToken(token));
    if (resp.token !== token) {
      // TODO Update the token on the auth.json?
      // TODO probably ask if they want to update it?
    }
  }

  if (resp.useTesting) {
    Object.assign(resp, await questions.getTestingDetails());
  }

  return resp;
}

module.exports = {
  run,
};
