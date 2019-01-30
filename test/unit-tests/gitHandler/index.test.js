const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const should = chai.should();

const gitHandler = require('../../../src/gitHandler');
const utils = require('../../../src/utils');


describe('Git handler', () => {
  const parentPath = path.resolve(path.join(os.homedir(), 'temp'));
  const folderPath = path.resolve(path.join(os.homedir(), 'temp', 'project'));

  before('create a project test folder', async () => {
    await fs.mkdir(parentPath, { recursive: true });
    await fs.mkdir(folderPath, { recursive: true });
  });

  after('clean up the project test folder', async () => {
    await utils.files.deleteDirRecursive(parentPath);
  });

  it('userValue for name should return a string without error', async () => {
    const value = await gitHandler.userValue('name');
    value.should.be.a('string');
  });

  it('userValue for email should return a string without error', async () => {
    const value = await gitHandler.userValue('email');
    value.should.be.a('string');
  });

  it('userValue for not real value should return undefined', async () => {
    const value = await gitHandler.userValue('false');
    should.equal(value, undefined);
  });

  it('git init creates a hidden .git folder', async () => {
    await gitHandler.init(folderPath);
    return fs.access(path.join(folderPath, '.git')).should.not.eventually.be.rejectedWith(Error);
  });

  it('commit should appear on log', async () => {
    await utils.process.execp('touch README.md', folderPath);
    await gitHandler.commit(folderPath, 'Initial commit');
    const resp = await utils.process.execp('git log --pretty=format:%s -1', folderPath);
    resp.should.equal('Initial commit');
  });

  it('add remote should work', async () => {
    await gitHandler.addRemote(folderPath, 'someurl', 'origin');
    let resp = await utils.process.execp('git remote get-url origin', folderPath);
    resp = resp.replace('\n', '');
    resp.should.equal('someurl');
  });
});
