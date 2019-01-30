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
    settings.settingsPath = authFileAnswers.settingsPath;
    settings.writeFile();

    currentAuthUser = await auth.firstUser();

    userAnswers = await questions.getGithubUser(currentAuthUser.user);

    currentToken = await auth.getToken(userAnswers.github.user);

    tokenAnswers = await questions.getAuthToken(userAnswers.github.user, currentToken);

    github.user = userAnswers.github.user;
    github.token = tokenAnswers.github.token;

    if (github.user !== currentAuthUser.user
      || github.token !== currentToken) {
      updateAnswers = await questions.confirmUpdateToken();
    }

    if (updateAnswers.updateToken) {
      auth.updateToken(github.user, github.token, settings.settingsPath);
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
