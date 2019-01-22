const questions = require('./questions');
const auth = require('../auth');
const settings = require('../settings');

async function run(name) {
  let remoteAnswers;
  let authFileAnswers;
  let userAnswers;
  let tokenAnswers;
  let currentAuthUser;
  let currentToken;

  const resp = await questions.getProjectDetails(name);

  if (!resp.useGithub) {
    remoteAnswers = await questions.getGitRemoteDetails();
    resp.hasRemote = !!remoteAnswers.git.url;
  } else {
    authFileAnswers = await questions.getAuthFile();

    currentAuthUser = await auth.firstUser(authFileAnswers.authPath);

    userAnswers = await questions.getGithubUser(currentAuthUser.user);

    currentToken = await auth.getToken(userAnswers.authUser, authFileAnswers.authPath);

    tokenAnswers = await questions.getAuthToken(userAnswers.authUser, currentToken);

    if ((userAnswers.authUser !== currentAuthUser.user || tokenAnswers.token !== currentToken)
    && questions.confirmUpdateToken()) {
      auth.updateToken(userAnswers.authUser, tokenAnswers.token, settings.authPath);
    }

    if (!currentToken) {
      resp.useGithub = false;
    }
  }

  Object.assign(resp, remoteAnswers, authFileAnswers, userAnswers, tokenAnswers);

  return resp;
}

module.exports = {
  run,
};
