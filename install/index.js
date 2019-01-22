const questions = require('../src/questionnaire/questions');
const settings = require('../src/settings');
const auth = require('../src/auth');

const AUTH_PATH = settings.authPath;

/**
 * Install function for the package, it set up the github auth details
 * TODO Consider the case for a previous auth file with different tokens
 */
(async () => {
  let user;

  try {
    user = await auth.firstUser(AUTH_PATH);
  } catch (e) {
    // console.log('fixme');
  }

  const authUser = await questions.getGithubUser(user.user || '');
  const authToken = await questions.getAuthToken(user.user || '', user.token || '');

  const authDetails = {
    github: [
      {
        user: authUser.github.user,
        token: authToken.github.token,
      },
    ],
  };

  await auth.writeAuthFile(authDetails, AUTH_PATH);
  console.log(`File ${AUTH_PATH} created with your github details`);
})();
