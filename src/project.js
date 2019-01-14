const { exec } = require('child_process');

class Project {

  constructor(args = {}) {
    this.name = args.name || '';
    this.description = args.description || '';
    this.version = args.version || '0.1.0';
    this.url = args.url || args.gitUrl;
    this.keywords = args.keywords || [];
    this.license = args.license || 'MIT';
    this.author = {
      name: args.authorName || this.gitUserName,
      email: args.authorEmail || this.gitUserEmail,
      url: args.authorUrl || '',
    };
    this.git = {
      name: args.name || '',
      url: args.gitUrl || '',
    };
    this.private = args.private || false;
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
      PROJECT_GIT_URL: `git+${this.git.url}`,
      PROJECT_GIT_BUGS: `${this.git.url}/issues`,
      PROJECT_PRIVATE: this.private,
    }
  }

  get gitUserName() {
    let name = '';
    exec('git config user.name', (error, stdout, stderr) => {
      if (error) {
        console.error('Is not possible to get the git information for the user name');
        return;
      }
      name = stdout; // FIXME async thing fails here
    });

    return name;
  }

  get gitUserEmail() {
    let email = '';
    exec('git config user.email', (error, stdout, stderr) => {
      if (error) {
        console.error('Is not possible to get the git information for the user email');
        return;
      }
      email = stdout; // FIXME async thing fails here
    });

    return email;
  }
}

module.exports = Project;
