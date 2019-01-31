const questions = require('./questions');

/**
 * Runs the full questionnaire for the configuration of the project
 * @method run
 * @param  {String} name       The name for the project
 * @param  {Settings} settings The settings object
 * @return {Object}            An object with all the answers
 */
async function run(name, settings) {
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

  const resp = await questions.promptProjectDetails(name, settings.licenses, settings.testingPkgs);

  if (!resp.useGithub) {
    remoteAnswers = await questions.promptGitRemoteDetails();
    resp.hasRemote = !!remoteAnswers.git.url;
  } else {
    authFileAnswers = await questions.promptSettingsFile(settings.settingsPath);
    const { settingsPath } = authFileAnswers;
    settings.update('settingsPath', settingsPath);

    currentAuthUser = await settings.firstUser();

    userAnswers = await questions.promptGithubUser(currentAuthUser.user);

    currentToken = await settings.getToken(userAnswers.github.user);

    tokenAnswers = await questions.promptAuthToken(userAnswers.github.user, currentToken);

    github.user = userAnswers.github.user;
    github.token = tokenAnswers.github.token;

    if (github.user !== currentAuthUser.user
      || github.token !== currentToken) {
      updateAnswers = await questions.promptUpdateToken();
    }

    if (updateAnswers.updateToken) {
      settings.updateToken(github.user, github.token, settings.settingsPath);
    }

    if (!currentToken) {
      resp.useGithub = false;
    }
  }

  Object.assign(resp, remoteAnswers, authFileAnswers, { github });

  return resp;
}

/**
 * The questionnaire for the project
 * @module questionnaire
 */
module.exports = {
  run,
};
