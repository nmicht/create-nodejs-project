const inquirer = require('inquirer');
const fs = require('fs');

const settings = require('../settings');
const utils = require('../utils');

async function getProjectDetails(defaults) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      default: defaults.projectName,
    },

    {
      type: 'input',
      name: 'description',
      message: 'How would you describe your project?',
    },

    {
      type: 'input',
      name: 'version',
      message: 'What version do you want to start with?',
      default: defaults.version,
    },

    {
      type: 'input',
      name: 'keywords',
      message: 'Provide a comma-separated list of keywords:',
      filter: ans => JSON.stringify(ans.split(',')),
    },

    {
      type: 'list',
      name: 'license',
      message: 'Please select a license',
      choices: settings.licenses,
      default: defaults.license,
    },

    {
      type: 'input',
      name: 'author.name',
      message: 'What is your name?',
      default: defaults.gitUserName,
    },

    {
      type: 'input',
      name: 'author.email',
      message: 'What is your email?',
      default: defaults.gitUserEmail,
    },

    {
      type: 'input',
      name: 'author.url',
      message: 'What is your website?',
    },

    {
      type: 'confirm',
      name: 'isPrivate',
      message: 'Is this project private?',
      default: false,
    },

    {
      type: 'input',
      name: 'projectURL',
      message: 'What is your project website?',
    },

    {
      type: 'checkbox',
      name: 'testPackages',
      message: 'Which test packages do you want to include?',
      choices: settings.testingPkgs,
    },

    {
      type: 'confirm',
      name: 'useGithub',
      message: 'Would you like to create a GitHub repository?',
    },
  ]);
}

async function getGitRemoteDetails() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'git.sshUrl',
      message: 'What git remote will you be using?',
      default: '', // TODO include here the default github url
    },

    {
      type: 'input',
      name: 'issueTracker',
      message: 'Where is your issue tracker?',
      default: '', // TODO include here the default github url
    },
  ]);
}

async function getAuthFile() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'authPath',
      message: 'What is the path for the auth.json file?',
      default: settings.authPath,
      validate: (ans) => {
        const path = utils.resolvePath(ans);
        if (path && fs.existsSync(path)) {
          return true;
        }
        return 'You should introduce a real path for the auth.json';
      },
    },
  ]);
}

async function getGithubUser(user) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'authUser',
      message: 'What is your github user?',
      default: user,
    },
  ]);
}

async function getAuthToken(user, token) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'token',
      message: `What is your GitHub token for user ${user}?`,
      default: token,
    },
  ]);
}

async function confirmUpdateToken() {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'updateToken',
      message: 'Do you want to update the auth.json file with this token?',
    },
  ]);
}

module.exports = {
  getProjectDetails,
  getGitRemoteDetails,
  getAuthFile,
  getAuthToken,
  confirmUpdateToken,
  getGithubUser,
};
