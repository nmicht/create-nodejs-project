const { exec } = require('child_process');
const gitHandler = require('./gitHandler')

class Project {
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

  async initGitConfig() {
    await this.setAuthorName();
    await this.setAuthorEmail();
  }

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

  async setAuthorName() {
    this.author.name = this.author.name || await gitHandler.userValue('name');
  }

  async setAuthorEmail() {
    this.author.email = this.author.email || await gitHandler.userValue('email');
  }
}

module.exports = Project;
