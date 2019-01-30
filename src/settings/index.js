const path = require('path');
const fs = require('fs').promises;

const utils = require('../utils');

const SETTINGS_PATH = path.resolve(path.join(__dirname, '..', '..', 'create-nodejs-settings.json'));

const settings = {
  lintPkgs: [
    'eslint',
    'eslint-plugin-node',
    'eslint-config-airbnb',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
  ],
  testingPkgs: [
    'jest',
    'mocha',
    'chai',
    'sinon',
    'nock',
  ],
  licenses: [
    'GNU AGPLv3',
    'GNU GPLv3',
    'GNU LGPLv3',
    'Mozilla Public License 2.0',
    'Apache License 2.0',
    'MIT License',
    'ISC License',
  ],
  settingsPath: SETTINGS_PATH,
  templatesPath: path.resolve(path.join(__dirname, '..', '..', 'templates')),
  nodejsTemplatePath: path.resolve(path.join(__dirname, '..', '..', 'templates', 'nodejs-project')),
  licensesPath: path.resolve(path.join(__dirname, '..', '..', 'templates', 'licenses')),
  defaults: {
    license: 'GNU GPLv3',
    version: '0.1.0',
  },
  auth: {
    github: [
      {
        user: 'YOUR_USER',
        token: 'YOUR_TOKEN',
      },
    ],
  },
  /**
   * Write the auth data json in the file
   * @param  {Object} data      The object/json data
   * @param  {String} filePath  The path
   * @return {Promise}
   */
  writeFile: function writeFile(data = this, filePath = this.settingsPath) {
    const json = JSON.stringify(data, null, 2);
    return fs.writeFile(filePath, json);
  },
  readFile: async function readFile(filePath = this.settingsPath) {
    const json = await utils.files.readJsonFile(filePath);
    this.defaults = json.defaults;
    this.auth = json.auth;
    this.lintPkgs = json.lintPkgs;
    this.testingPkgs = json.testingPkgs;
    this.licenses = json.licenses;
    this.settingsPath = json.settingsPath;
    this.templatesPath = json.templatesPath;
    this.nodejsTemplatePath = json.nodejsTemplatePath;
    this.licensesPath = json.licensesPath;
  },
};

module.exports = settings;
