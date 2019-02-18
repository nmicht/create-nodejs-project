const os = require('os');
const path = require('path');
const fs = require('fs').promises;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

const utils = require('../../../src/utils');

describe('Utils for files', () => {
  const jsonPath = 'test/unit-tests/settings/test-settings.json';
  const otherFile = 'test/unit-tests/utils/file.txt';
  const copyFolder = path.resolve('test/unit-tests');
  const tempFolder = path.resolve(path.join(os.homedir(), 'temp'));
  const testFolder = path.resolve(path.join(os.homedir(), 'temp', 'project'));

  after('tear down', async () => {
    await utils.files.deleteDirRecursive(tempFolder);
  });

  it('resolve path works using tilde on any os different than win32', async () => {
    utils.files.resolvePath('~').should.equal(os.homedir());
  });

  it('read json file should return a valid object', async () => {
    const file = await utils.files.readJsonFile(jsonPath);
    file.should.be.a('object');
  });

  it('read json file should throw error when file is not a json', async () => {
    return utils.files.readJsonFile(otherFile).should.eventually.be.rejectedWith(Error);
  });

  it('copy dir will create all the parent folders required', async () => {
    await utils.files.copyDirRecursive(copyFolder, testFolder);
    return fs.access(tempFolder).should.not.eventually.be.rejectedWith(Error);
  });

  it('delete should remove the folder and its content', async () => {
    await utils.files.deleteDirRecursive(tempFolder);
    return fs.access(tempFolder).should.eventually.be.rejectedWith(Error);
  });

  it('copy dir count should matches for dir and files', async () => {
    let finalCount = 0;
    let originalCount = 0;

    await utils.files.copyDirRecursive(copyFolder, testFolder);

    const originalFiles = await fs.readdir(copyFolder);
    originalCount = originalFiles.length;

    const finalFiles = await fs.readdir(testFolder);
    finalCount = finalFiles.length;

    return finalCount.should.be.equal(originalCount);
  });
});
