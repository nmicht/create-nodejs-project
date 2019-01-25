const path = require('path');
const os = require('os');

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
  authPath: path.join(os.homedir(), 'create-nodejs-project.json'),
  default: {
    license: 'GNU GPLv3',
    version: '0.1.0',
  },
};

module.exports = settings;
