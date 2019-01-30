const utils = require('../src/utils');
const githubHandler = require('../src/githubHandler');

function cleanup(projectPath = 'a-demo-project') {
  const name = utils.string.normalizeName(projectPath);

  // Remove test folder
  console.log(`Deleting folder ${projectPath}`);
  utils.files.deleteDirRecursive(projectPath);

  // Delete github project
  githubHandler.deleteRepo(name, 'nmicht');
}

cleanup(process.argv[2]);
