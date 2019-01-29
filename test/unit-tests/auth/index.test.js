const assert = require('assert');
const should = require('chai').should();

const auth = require('../../../src/auth');

describe('Authentication file management', () => {
  const filePath = 'test/unit-tests/auth/test-auth.json';

  it('The object from file should have github property', async () => {
    const file = await auth.getFileData(filePath);
    file.should.have.property('github');
  });

  it('firsUser should return the first user', async () => {
    const user = await auth.firstUser(filePath);
    user.user.should.be.equals('first');
  });

  it('findUser should return the user', async () => {
    const user = await auth.findUser('second', filePath);
    user.user.should.be.equals('second');
  });

  it('findUser should return undefined when the user is not found', async () => {
    const user = await auth.findUser('forth', filePath);
    should.equal(user, undefined);
  });

  it('getToken should return the token when the user exists', async () => {
    const token = await auth.getToken('first', filePath);
    token.should.be.equals('the-token');
  });

  it('getToken should return undefined if the user does not exist', async () => {
    const token = await auth.getToken('forth', filePath);
    should.equal(token, undefined);
  });
});
