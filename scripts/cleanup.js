const settings = require('../src/settings');
const githubHandler = require('../src/githubHandler');
const utils = require('../src/utils');

async function cleanup(projectPath = 'a-demo-project') {
  await settings.load();

  const name = utils.string.normalizeName(projectPath);

  // Remove test folder
  console.log(`Deleting folder ${projectPath}`);
  utils.files.deleteDirRecursive(projectPath);

  // Delete github project
  githubHandler.deleteRepo(name, settings.githubAuth.user, settings.githubAuth.token);
}

cleanup(process.argv[2]);
