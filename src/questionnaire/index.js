const questions = require('./questions');
const auth = require('../auth');

async function run(name) {
  const resp = await questions.getProjectDetails(name);

  if (!resp.useGithub) {
    Object.assign(resp, await questions.getGitRemoteDetails());
  } else {
    Object.assign(resp, await questions.getAuthFile());
    const token = await auth.getToken(resp.authPath);
    Object.assign(resp, await questions.getAuthToken(token));
    if (resp.token !== token) {
      // Update the token on the auth.json?
      // probably ask if they want to update it?
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