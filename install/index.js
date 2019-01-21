const fs = require('fs');
const path = require('path');

const questions = require('../src/questionnaire/questions');
const settings = require('../src/settings');

const AUTH_PATH = path.resolve(settings.authPath);

/**
 * Install function for the package, it set up the github auth details
 */
(async () => {
  const authDetails = await Promise.all([questions.getGithubUser(''), questions.getAuthToken('', '')])
    .then((data) => {
      const [authUser, token] = data;
      return {
        github: [
          {
            user: authUser,
            token,
          },
        ],
      };
    });

  fs.writeFileSync(AUTH_PATH, JSON.stringify(authDetails));
  console.log(`File ${AUTH_PATH} created with your github details`);
})();
