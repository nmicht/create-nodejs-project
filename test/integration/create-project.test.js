const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const should = chai.should();

const githubHandler = require('../../src/gitHandler');
const utils = require('../../src/utils');

describe('Create a project', () => {
  const projectPath = '~/dev/my-new-project';

  after('Delete the project', () => {
    const name = utils.string.normalizeName(projectPath);

    // Remove test folder
    console.log(`Deleting folder ${projectPath}`);
    utils.files.deleteDirRecursive(projectPath);

    // Delete github project
    githubHandler.deleteRepo(name, 'nmicht');
  });
});
