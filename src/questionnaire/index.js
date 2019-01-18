const questions = require('./questions');
const auth = require('../auth');
const settings = require('../settings');

async function run(name) {
  const resp = await questions.getProjectDetails(name);

  if (!resp.useGithub) {
    Object.assign(resp, await questions.getGitRemoteDetails());
    resp.hasRemote = !!resp.git.url;
  } else {
    Object.assign(resp, await questions.getAuthFile());
    const token = await auth.getToken(resp.authPath);
    Object.assign(resp, await questions.getAuthToken(token));
    if (resp.token) {
      if (resp.token !== token && await auth.confirmUpdateToken()) {
        auth.updateToken(resp.token, settings.authPath);
      }
    } else {
      resp.useGithub = false;
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
