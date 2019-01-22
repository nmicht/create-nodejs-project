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

  const github = {};
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

    currentToken = await auth.getToken(userAnswers.github.user, authFileAnswers.authPath);

    tokenAnswers = await questions.getAuthToken(userAnswers.github.user, currentToken);

    github.user = userAnswers.github.user;
    github.token = tokenAnswers.github.token;

    if (github.user !== currentAuthUser.user
      || github.token !== currentToken) {
      updateAnswers = await questions.confirmUpdateToken();
    }

    if (updateAnswers.updateToken) {
      auth.updateAuthFile(github.user, github.token, settings.authPath);
    }

    if (!currentToken) {
      resp.useGithub = false;
    }
  }

  Object.assign(resp, remoteAnswers, authFileAnswers, { github });

  return resp;
}

module.exports = {
  run,
};
