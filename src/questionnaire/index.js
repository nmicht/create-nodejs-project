const questions = require('./questions');
const auth = require('../auth');
const settings = require('../settings');

async function run(name) {
  let remoteAnswers;
  let authFileAnswers;
  let userAnswers;
  let tokenAnswers;
  let updateAnswers = {
    updateToken: false,
  };

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

    currentToken = await auth.getToken(userAnswers.user, authFileAnswers.authPath);

    tokenAnswers = await questions.getAuthToken(userAnswers.user, currentToken);


    if (userAnswers.user !== currentAuthUser.user || tokenAnswers.token !== currentToken) {
      updateAnswers = await questions.confirmUpdateToken();
    }

    if (updateAnswers.updateToken) {
      auth.updateAuthFile(userAnswers.user, tokenAnswers.token, settings.authPath);
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
