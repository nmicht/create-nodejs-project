const gitHandler = require('./gitHandler')

/**
 * Project handle all the information for the new node project
 *
 * @class Project
 * @constructor
 */
class Project {
  /**
   * The Project constructor
   * @param {String}  [name='']         The name of the project
   * @param {String}  [description='']  The description of the project used on github, readme and package.json
   * @param {String}  [version='0.1.0'] The version for the project
   * @param {String}  [url='']          The public url of the project
   * @param {Array}   [keywords=[]]     An array separated by comma with the keywords of the project
   * @param {String}  [license='MIT']   The license for the project
   * @param {Object}  [author]
   * @param {String}  [author.name='']  The name of the author
   * @param {String}  [author.email=''] The email of the author
   * @param {[type]}  [author.url='']   The url of the author
   * @param {Boolean} [hasGithub=false] If the project has a git url
   * @param {Object}  [git]
   * @param {String}  [git.name='']     The git project name
   * @param {String}  [git.httpUrl='']  The git http url
   * @param {String}  [git.sshUrl='']   The git ssh url
   * @param {Boolean} [isPrivate=false] If the project is private or public
   * @param {String}  [path='']         The path for the project folder
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
    hasRemote = false,
    git = {
      name: '',
      httpUrl: '',
      sshUrl: '',
    },
    issueTracker = '',
    isPrivate = false,
    path = '',
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
    this.hasRemote = hasRemote;
    this.git = {
      name: git.name,
      httpUrl: git.httpUrl,
      sshUrl: git.sshUrl,
    };
    this.issueTracker = issueTracker;
    this.isPrivate = isPrivate;
    this.path = path;
  }

  /**
   * Initializes the project git values
   * @method initGitConfig
   * @return {Promise}
   */
  async initGitConfig() {
    await this.setAuthorName();
    await this.setAuthorEmail();
  }

  /**
   * Returns a dictionary to be used for templating
   * @method get dictionary
   * @return {Object} A dictionary with project values
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
      PROJECT_AUTHOR_EMAIL: `<${this.author.email}>`,
      PROJECT_AUTHOR_URL: `(${this.author.url})`,
      PROJECT_GIT_URL: `git+${this.git.httpUrl}`,
      PROJECT_ISSUETRACKER: `${this.issueTracker}`,
      PROJECT_PRIVATE: this.isPrivate,
    };
  }

  /**
   * Set the project's author name using git information
   * @method setAuthorName
   * @return {Promise}
   */
  async setAuthorName() {
    this.author.name = this.author.name || await gitHandler.userValue('name');
  }

  /**
   * Set the project's author email using git information
   * @method setAuthorEmail
   * @return {Promise}
   */
  async setAuthorEmail() {
    this.author.email = this.author.email || await gitHandler.userValue('email');
  }
}

module.exports = Project;
