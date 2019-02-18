const chai = require('chai');

chai.should();

const utils = require('../../../src/utils');

describe('Utils for processes', () => {
  it('execp returns a promise', async () => {
    const p = utils.process.execp('ls');
    return (p instanceof Promise).should.be.true;
  });

  it('spawn returns a promise', async () => {
    const p = utils.process.spawnp('ls');
    return (p instanceof Promise).should.be.true;
  });
});
