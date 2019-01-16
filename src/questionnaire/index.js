const questions = require('./questions');

async function run(name) {
  const resp = await questions.getProjectDetails(name);

  if (!resp.useGithub) {
    Object.assign(resp, await questions.getGitRemoteDetails());
  }

  if (resp.useTesting) {
    Object.assign(resp, await questions.getTestingDetails());
  }

  return resp;
}

module.exports = {
  run,
};
