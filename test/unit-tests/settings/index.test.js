const should = require('chai').should();

const settings = require('../../../src/settings');

describe('Settings management', () => {
  const filePath = 'test/unit-tests/settings/test-settings.json';

  before('load settings data', async () => {
    await settings.load(filePath);
  });

  it('The object settings should have githubAuth property', () => {
    settings.should.have.property('githubAuth');
  });

  it('firsUser should return the first user', () => {
    const user = settings.firstUser();
    user.user.should.be.equals('YOUR_USER');
  });

  it('findUser should return the user', () => {
    const user = settings.findUser('YOUR_USER', filePath);
    user.user.should.be.equals('YOUR_USER');
  });

  it('findUser should return undefined when the user is not found', () => {
    const user = settings.findUser('forth', filePath);
    should.equal(user, undefined);
  });

  it('getToken should return the token when the user exists', () => {
    const token = settings.getToken('YOUR_USER', filePath);
    token.should.be.equals('YOUR_TOKEN');
  });

  it('getToken should return undefined if the user does not exist', () => {
    const token = settings.getToken('forth', filePath);
    should.equal(token, undefined);
  });
});
