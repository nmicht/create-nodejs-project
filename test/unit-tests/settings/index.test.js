const should = require('chai').should();

const settings = require('../../../src/settings');

describe.only('Settings management', () => {
  const filePath = 'test/unit-tests/settings/test-settings.json';
  const licenses = [
    'GNU AGPLv3',
    'GNU GPLv3',
    'GNU LGPLv3',
    'Mozilla Public License 2.0',
    'Apache License 2.0',
    'MIT License',
    'ISC License',
  ];

  before('load settings data', async () => {
    await settings.load(filePath);
  });

  it('The settings have the licenses default', () => {
    return settings.licenses.should.be.eql(licenses);
    // settings.githubAuth = {
    //   user: githubAuth.user,
    //   token: githubAuth.token,
    // };
    // settings.lintPkgs = lintPkgs;
    // settings.testingPkgs = testingPkgs;
    // settings.defaults = {
    //   license: defaults.license,
    //   version: defaults.version,
    //   template: defaults.template,
    // };
    // settings.templates = templates;
    // settings.settingsPath = settingsPath;
    // settings.templatesPath = templatesPath;
    // settings.licensesPath = licensesPath;
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
