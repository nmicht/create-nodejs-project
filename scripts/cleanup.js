const settings = require('../src/settings');
const githubHandler = require('../src/githubHandler');
const utils = require('../src/utils');

async function cleanup(projectPath = 'a-demo-project') {
  await settings.load();
  const name = utils.string.normalizeName(projectPath);

  await githubHandler.deleteRepo(name, settings.githubAuth.user, settings.githubAuth.token);

  utils.files.deleteDirRecursive(projectPath);
}

cleanup(process.argv[2]);
