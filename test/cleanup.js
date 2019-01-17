const utils = require('../src/utils');
const githubHandler = require('../src/githubHandler');

function cleanup(name = 'a-demo-project') {
  // Remove test folder
  console.log(`Deleting folder ${name}`);
  utils.deleteDirRecursive(`../${name}`);

  // Delete github project
  githubHandler.deleteRepo(name, 'nmicht');
}

cleanup(process.argv[2]);
