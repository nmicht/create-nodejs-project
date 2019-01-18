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
    'ISC',
    'AGPL-3.0-only',
    'AGPL-3.0-or-later',
    'Apache-2.0',
    'GPL-3.0-only',
    'GPL-3.0-or-later',
    'LGPL-3.0-only',
    'LGPL-3.0-or-later',
    'MIT',
  ],
  authPath: path.join(os.homedir(), 'auth.json'),
  default: {
    license: 'MIT',
    version: '0.1.0',
  },
};

module.exports = settings;
