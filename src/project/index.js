const fs = require('fs').promises;

const questionnaire = require('../questionnaire');
const gitHandler = require('../gitHandler');
const githubHandler = require('../githubHandler');
const template = require('../template');
const utils = require('../utils');

/**
 * Project handle all the information for the new node project
 *
 * @class Project
 * @constructor
 */
class Project {
  /**
   * The Project constructor
   * @method constructor
   * @param {String}  [name='']         The name of the project
   * @param {String}  [description='']  The description of the project
   * @param {String}  [version='0.1.0'] The version for the project
   * @param {String}  [url='']          The public url of the project
   * @param {Array}   [keywords=[]]     An array separated by comma with the keywords of the project
   * @param {String}  [license='MIT']   The license for the project
   * @param {Object}  [author]
   * @param {String}  [author.name='']  The name of the author
   * @param {String}  [author.email=''] The email of the author
   * @param {[type]}  [author.url='']   The url of the author
   * @param {Boolean} [useGithub=false] If the project will use the github integration
   * @param {Object}  [github]
   * @param {String}  [github.user='']  The github user
   * @param {String}  [github.token=''] The github token
   * @param {Boolean} [hasRemote=false] If the project has a git url
   * @param {Object}  [git]
   * @param {String}  [git.name='']     The git project name
   * @param {String}  [git.httpUrl='']  The git http url
   * @param {String}  [git.sshUrl='']   The git ssh url
   * @param {String}  [issueTracker=''] The url for issue tracker
   * @param {Boolean} [isPrivate=false] If the project is private or public
   * @param {String}  [path='']         The full path for the project folder
   * @param {String}  [year='']         The year to be used on the license
   * @param {Array}   [testPackages=[]] The list of the test packages selected
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
    useGithub = false,
    github = {
      user: '',
      token: '',
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
    year = '',
    testPackages = [],
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
    this.useGithub = useGithub;
    this.github = {
      user: github.user,
      token: github.token,
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
    this.year = year || (new Date()).getFullYear();
    this.testPackages = testPackages;
  }

  /**
   * Initializes the project git values
   * @method initGitConfig
   * @return {Promise}
   */
  async initGitConfig() {
    await Promise.all([this.initializeAuthorName(), this.setAuthorEmail()]);
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
      PROJECT_AUTHOR_EMAIL: this.author.email,
      PROJECT_AUTHOR_URL: this.author.url,
      PROJECT_GIT_URL: this.git.sshUrl,
      PROJECT_ISSUETRACKER: this.issueTracker,
      PROJECT_PRIVATE: this.isPrivate,
      PROJECT_YEAR: this.year,
    };
  }

  /**
   * Set the project's author name using git information
   * @method initializeAuthorName
   * @return {Promise}
   */
  async initializeAuthorName() {
    this.author.name = this.author.name || await gitHandler.userValue('name');
  }

  /**
   * Set the project's author email using git information
   * @method initializeAuthorEmail
   * @return {Promise}
   */
  async initializeAuthorEmail() {
    this.author.email = this.author.email || await gitHandler.userValue('email');
  }

  /**
   * Set the github values into the object
   * @method setGithubValues
   * @param {Object} data All the github data
   */
  setGithubValues(data) {
    this.git.httpUrl = data.html_url;
    this.git.name = data.name;
    this.git.sshUrl = data.ssh_url;
    this.issueTracker = `${this.git.httpUrl}/issues`;
    this.hasRemote = !!this.git.sshUrl;
  }

  /**
   * Install the npm dev dependencies
   * @method installDependencies
   * @return {Promise}
   */
  async installDependencies() {
    console.info('Installing dev dependencies ...');
    const args = ['install', '-D', ...Project.settings.lintPkgs, ...this.testPackages];
    await utils.process.spawnp(
      'npm',
      args,
      this.path,
    );
  }

  /**
   * Do the initial commit for the project
   * @method commit
   * @return {Promise}
   */
  async commit() {
    const commitResult = await gitHandler.commit(this.path);
    console.log('Code commited');
    console.info(commitResult);
  }

  /**
   * Push the project code to the remote
   * @method push
   * @return {Promise}
   */
  async push() {
    if (this.hasRemote) {
      await gitHandler.push(this.path);
      console.log(`Code pushed to ${this.git.sshUrl}`);
    }
  }

  /**
   * Copy the template files to the project folder, update them and generate the
   * license.
   * @method generateTemplateFiles
   * @return {Promise}
   */
  async generateTemplateFiles() {
    await template.copyTemplate(Project.settings.nodejsTemplatePath, this.path);

    return Promise.all([
      template.updateTemplateFiles(this.dictionary, this.path),
      template.copyLicense(
        this.license,
        this.dictionary,
        Project.settings.licensesPath,
        this.path
      ),
    ]);
  }

  /**
   * Create a github repository for the project
   * @method createGithubRepository
   * @return {Promise}
   */
  async createGithubRepository() {
    if (this.useGithub) {
      const resp = await githubHandler.create(this);
      if (resp) {
        this.setGithubValues(resp);
        gitHandler.addRemote(this.path, this.git.sshUrl);
      }
    }
  }

  /**
   * Initialize a git repository on the project folder
   * @method initializeGitRepository
   * @return {Promise}
   */
  async initializeGitRepository() {
    const resp = await gitHandler.init(this.path);
    console.info(resp);
    console.log('Git repository initialized');
  }

  /**
   * Create the project folder
   * @method createFolder
   * @return {Promise}
   */
  async createFolder() {
    await fs.mkdir(this.path, { recursive: true });
    console.log(`Project folder ${this.path} created`);
  }

  /**
   * Obtain the project details
   * @method getDetails
   * @param  {String}  destPath The project destination full path folder
   * @return {Promise}
   */
  static async getDetails(destPath) {
    const defaults = await Promise.all([gitHandler.userValue('name'), gitHandler.userValue('email')])
      .then((data) => {
        const [name, email] = data;
        return {
          projectName: utils.string.normalizeName(destPath),
          gitUserName: name,
          gitUserEmail: email,
          license: Project.settings.defaults.license,
          version: Project.settings.defaults.version,
        };
      });

    // Questionnaire for the options
    const answers = await questionnaire.run(defaults, Project.settings);

    // Add extra values to the answers
    Object.assign(answers, {
      path: destPath,
    });

    return answers;
  }

  /**
   * Obtain the destination path for the project
   * @method getDestPath
   * @param  {String}  arg The param used when the initializer runs
   * @return {Promise}
   * @throws if the path is not valid
   */
  static async getDestPath(arg) {
    const destPath = utils.files.resolvePath(arg);

    if (!destPath) {
      throw new Error('A path for the new project is required');
    }

    // TODO Include here a way to get "options" for the other args

    // Do not continue if the project folder already exists.
    return new Promise((resolve, reject) => {
      fs.access(destPath)
        .then(() => reject(new Error(`The project folder '${destPath} already exists. You need to specify a different path.`)))
        .catch(() => resolve(destPath));
    });
  }

  /**
   * Set the project dependencies
   * @method setDependencies
   * @param {Settings} settings Settings object to be injected as dependency
   */
  static setDependencies(settings) {
    Project.settings = settings;
  }
}

/**
 * The project class
 * @module project
 */
module.exports = Project;
