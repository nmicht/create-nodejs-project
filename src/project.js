const { exec } = require('child_process');
const gitHandler = require('./gitHandler')

/**
 * [Project description]
 *
 * @class Project
 * @constructor
 */
class Project {
  /**
   * [constructor description]
   * @method constructor
   * @param {String}  [name='']         [description]
   * @param {String}  [description='']  [description]
   * @param {String}  [version='0.1.0'] [description]
   * @param {String}  [url='']          [description]
   * @param {Array}   [keywords=[]]     [description]
   * @param {String}  [license='MIT']   [description]
   * @param {Object}  [author={                           name: ''] [description]
   * @param {[type]}  email             [description]
   * @param {[type]}  url               [description]
   * @param {[type]}  }                 [description]
   * @param {Boolean} [hasGithub=false] [description]
   * @param {Object}  [git={                              name: ''] [description]
   * @param {[type]}  httpUrl           [description]
   * @param {[type]}  sshUrl            [description]
   * @param {[type]}  }                 [description]
   * @param {Boolean} [isPrivate=false] [description]
   * @param {[type]}  }                 [description]
   */
  constructor({
    name = '',
    description = '',
    version = '0.1.0',
    url = '',
    keywords = [],
    license = 'MIT',
    author = {
      name: '',
      email: '',
      url: '',
    },
    hasGithub = false,
    git = {
      name: '',
      httpUrl: '',
      sshUrl: '',
    },
    isPrivate = false,
  }) {
    this.name = name;
    this.description = description;
    this.version = version;
    this.url = url;
    this.keywords = keywords;
    this.license = license;
    this.author = {
      name: author.name,
      email: author.email,
      url: author.url,
    };
    this.hasGithub = hasGithub;
    this.git = {
      name: git.name,
      httpUrl: git.httpUrl,
      sshUrl: git.sshUrl,
    };
    this.isPrivate = isPrivate;
  }

  /**
   * [initGitConfig description]
   * @method initGitConfig
   * @return {Promise} [description]
   */
  async initGitConfig() {
    await this.setAuthorName();
    await this.setAuthorEmail();
  }

  /**
   * [dictionary description]
   * @method get dictionary
   * @return {[type]} [description]
   */
  get dictionary() {
    return {
      PROJECT_NAME: this.name,
      PROJECT_DESCRIPTION: this.description,
      PROJECT_VERSION: this.version,
      PROJECT_URL: this.url,
      PROJECT_KEYWORDS: this.keywords,
      PROJECT_LICENSE: this.license,
      PROJECT_AUTHOR_NAME: this.author.name,
      PROJECT_AUTHOR_EMAIL: this.author.email,
      PROJECT_AUTHOR_URL: this.author.url,
      PROJECT_GIT_URL: `git+${this.git.httpUrl}`,
      PROJECT_GIT_BUGS: `${this.git.httpUrl}/issues`,
      PROJECT_PRIVATE: this.isPrivate,
    };
  }

  /**
   * [setAuthorName description]
   * @method setAuthorName
   * @return {Promise} [description]
   */
  async setAuthorName() {
    this.author.name = this.author.name || await gitHandler.userValue('name');
  }

  /**
   * [setAuthorEmail description]
   * @method setAuthorEmail
   * @return {Promise} [description]
   */
  async setAuthorEmail() {
    this.author.email = this.author.email || await gitHandler.userValue('email');
  }
}

module.exports = Project;
