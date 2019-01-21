const questions = require('./questions');
const auth = require('../auth');
const settings = require('../settings');

async function run(name) {
  const resp = await questions.getProjectDetails(name);
  let remoteAnswers;
  let authFileAnswers;
  let userAnswers;
  let tokenAnswers;
  let currentAuthUser;
  let currentToken;

  if (!resp.useGithub) {
    remoteAnswers = await questions.getGitRemoteDetails();
    resp.hasRemote = !!remoteAnswers.git.url;
  } else {
    authFileAnswers = await questions.getAuthFile();

    currentAuthUser = auth.firstUser(authFileAnswers.authPath).user;

    userAnswers = await questions.getGithubUser(currentAuthUser);

    currentToken = auth.getToken(userAnswers.authUser, authFileAnswers.authPath);

    tokenAnswers = await questions.getAuthToken(userAnswers.authUser, currentToken);

    if ((userAnswers.authUser !== currentAuthUser || tokenAnswers.token !== currentToken)
    && questions.confirmUpdateToken()) {
      auth.updateToken(userAnswers.authUser, tokenAnswers.token, settings.authPath);
    } else {
      resp.useGithub = false;
    }
  }

  Object.assign(resp, remoteAnswers, authFileAnswers, userAnswers, tokenAnswers);

  return resp;
}

module.exports = {
  run,
};
