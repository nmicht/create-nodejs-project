const path = require('path');
const os = require('os');

class Settings {
  constructor() {
    this.lintPkgs = [
      'eslint',
      'eslint-plugin-node',
      'eslint-config-airbnb',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
    ];

    this.testingPkgs = [
      'jest',
      'mocha',
      'chai',
      'sinon',
      'nock',
    ];

    this.licenses = [
      'ISC',
      'AGPL-3.0-only',
      'AGPL-3.0-or-later',
      'Apache-2.0',
      'GPL-3.0-only',
      'GPL-3.0-or-later',
      'LGPL-3.0-only',
      'LGPL-3.0-or-later',
      'MIT',
    ];
  }

  static get authPath() {
    return path.join(os.homedir(), 'auth.json');
  }
}

module.exports = new Settings();
