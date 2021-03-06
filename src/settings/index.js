const path = require('path');
const fs = require('fs').promises;

const utils = require('../utils');

const SETTINGS_PATH = path.resolve(path.join(__dirname, '..', '..', 'create-nodejs-settings.json'));

/**
 * A settings class
 * @class Settings
 */
class Settings {
  constructor({
    lintPkgs = [
      'eslint',
      'eslint-plugin-node',
      'eslint-config-airbnb',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
    ],
    testingPkgs = [
      'jest',
      'mocha',
      'chai',
      'sinon',
      'nock',
    ],
    licenses = [
      'GNU AGPLv3',
      'GNU GPLv3',
      'GNU LGPLv3',
      'Mozilla Public License 2.0',
      'Apache License 2.0',
      'MIT License',
      'ISC License',
    ],
    templates = [
      'nodejs-project',
    ],
    settingsPath = SETTINGS_PATH,
    templatesPath = path.resolve(path.join(__dirname, '..', '..', 'templates')),
    licensesPath = path.resolve(path.join(__dirname, '..', '..', 'templates', 'licenses')),
    defaults = {
      license: 'GNU GPLv3',
      version: '0.1.0',
      template: 'nodejs-project',
    },
    githubAuth = {
      user: 'YOUR_USER',
      token: 'YOUR_TOKEN',
    },
  }) {
    this.licenses = licenses;
    this.githubAuth = {
      user: githubAuth.user,
      token: githubAuth.token,
    };
    this.lintPkgs = lintPkgs;
    this.testingPkgs = testingPkgs;
    this.defaults = {
      license: defaults.license,
      version: defaults.version,
      template: defaults.template,
    };
    this.templates = templates;
    this.settingsPath = settingsPath;
    this.templatesPath = templatesPath;
    this.licensesPath = licensesPath;
  }

  /**
   * Write the auth data json in the file
   * @method update
   * @param  {String} [property='all']        The property to be updated
   * @param  {String|Array|Object} [data='']  The value to be updated
   * @param  {String} filePath                The path of the file
   * @return {Promise}
   */
  update(property = 'all', value = '', filePath = this.settingsPath) {
    if (property !== 'all') {
      this[property] = value;
    }
    const json = JSON.stringify(this, null, 2);
    return fs.writeFile(filePath, json);
  }

  /**
   * Load the settings values from the settings file
   * @method load
   * @param  {String}  [filePath=this.settingsPath] The path for the settings file
   * @return {Promise}
   */
  async load(filePath = this.settingsPath) {
    fs.access(filePath);
    const json = await utils.files.readJsonFile(filePath);
    this.defaults = json.defaults;
    this.githubAuth = json.githubAuth;
    this.lintPkgs = json.lintPkgs;
    this.testingPkgs = json.testingPkgs;
    this.licenses = json.licenses;
    this.settingsPath = json.settingsPath;
    this.templatesPath = json.templatesPath;
    this.templates = json.templates;
    this.licensesPath = json.licensesPath;
  }

  /**
   * Return the first user on the auth settings
   * @method firstUser
   * @return {Object|undefined}
   * TODO implement logic to allow multiple auth values
   */
  firstUser() {
    return this.githubAuth;
  }

  /**
   * Find a user on the auth settings
   * @method findUser
   * @param  {String} user       The user to find
   * @return {Object|undefined}
   * TODO implement logic to allow multiple auth values
   */
  findUser(user) {
    return this.githubAuth.user === user ? this.githubAuth : undefined;
  }

  /**
   * Get the Github token from the auth settings
   * @method getToken
   * @param  {String} user      The user owner of the token
   * @return {String|undefined} The github token or undefined if there is no token.
   * TODO implement logic to allow multiple auth values
   */
  getToken(user) {
    return this.githubAuth.user === user ? this.githubAuth.token : undefined;
  }

  /**
   * Update the auth settings
   * @method updateToken
   * @param  {String} user    The user owner of the token
   * @param  {String} token   The token
   * @return {Promise}        Resolve with true in case the file gets updated
   * TODO implement logic to allow multiple auth values
   */
  async updateToken(user, token) {
    let currentToken = '';
    let userIndex;

    currentToken = this.firstUser().token;

    if (user) {
      // TODO consider the case for a new user data
      userIndex = this.githubAuth.findIndex(elem => elem.user === user);
      currentToken = this.githubAuth[userIndex].token;
    }

    if (currentToken === token) {
      return false;
    }

    this.githubAuth[userIndex].token = token;
    await this.update();

    return true;
  }
}

/**
 * @module settings
 */
module.exports = new Settings({});
