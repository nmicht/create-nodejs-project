const questions = require('../src/questionnaire/questions');
const settings = require('../src/settings');

/**
 * Install function for the package, it set up the github auth details
 * TODO Consider the case for a previous auth file with different tokens
 */
(async () => {
  let user;
  await settings.load();

  const authFileAnswers = await questions.promptSettingsFile(settings.settingsPath);
  settings.settingsPath = authFileAnswers.settingsPath;

  try {
    user = await settings.firstUser();
  } catch (e) {
    // console.log('fixme');
  }


  const authUser = await questions.promptGithubUser(user.user || '');
  const authToken = await questions.promptAuthToken(user.user || '', user.token || '');

  settings.githubAuth = {
    user: authUser.github.user,
    token: authToken.github.token,
  };

  await settings.update();
  console.log(`Your settings file was updated on ${settings.settingsPath}`);
})();
