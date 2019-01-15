const { exec } = require('child_process');
const path = require('path');
const lodash = require('lodash');
const fs = require('fs');

const Project = require('./project');
const utils = require('./utils');
const gitHandler = require('./gitHandler');
const githubHandler = require('./githubHandler');

async function myPackage() {
  // First arg = path
  const destPath = path.resolve(process.argv[2]);

  // Get the other args
  let options = process.argv[3];
  // console.log(process.argv[2], options);

  // - use defaults
  // - do questions
  // - avoid things?

  // Do not continue if the project folder already exists.
  if (fs.existsSync(destPath)) {
    throw new Error(`The project folder '${destPath} already exists. You need to specify a different path.`);
  }

  // Create folder
  try {
    fs.mkdirSync(destPath);
  } catch (error) {
    // console.error(`The folder project was not created. See details on the log`);
    throw error;
  }


  // Create project object
  const project = new Project({
    name: lodash.last(destPath.split(path.sep)).toLowerCase(),
  });

  // Setup git configuration values
  try {
    await project.initGitConfig();
  } catch (e) {
    console.error(e);
  }

  // Initialize git
  await gitHandler.init(destPath);

  // Create github repository
  const result = await githubHandler.create(project.name, project.isPrivate);
  if (result !== false) {
    console.log('Github repository created');
    project.hasGithub = true;
    project.git.httpUrl = result.html_url;
    project.git.name = result.name;
    project.git.sshUrl = result.ssh_url;
    gitHandler.addRemote(destPath, project.git.sshUrl);
  }

  // Copy template files
  utils.copyDirRecursive('template', destPath);

  // Update package.json with project data
  let originalPackageFile;
  try {
    originalPackageFile = fs.readFileSync('./template/package.json', 'utf8');
  } catch (error) {
    throw error;
  }

  const generatedPackageFile = utils.replaceByDictionary(originalPackageFile, project.dictionary);
  fs.writeFile(`${destPath}/package.json`, generatedPackageFile, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log('File updated: package.json');
  });

  // Update readme with project data
  let originalReadmeFile;
  try {
    originalReadmeFile = fs.readFileSync('./template/README.md', 'utf8');
  } catch (error) {
    throw error;
  }

  const generatedReadmeFile = utils.replaceByDictionary(originalReadmeFile, project.dictionary);
  fs.writeFile(`${destPath}/README.md`, generatedReadmeFile, (err) => {
    if (err) {
      throw err;
    }
    console.log('File updated: README.md');
  });

  // Install devDependencies
  // TODO Make dependencies dynamic
  // TODO make the stdout visible for npm process
  console.log('Installing dev dependencies...');
  const installDependencies = exec(`cd ${destPath} && npm install eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react jest`, (error) => {
    if (error) {
      // console.error('There was an error with the devDependencies');
      throw error;
    }
  });

  installDependencies.stdout.pipe(process.stdout);

  // Commit and push
  await gitHandler.commit(destPath);

  if (project.hasGithub) {
    gitHandler.push(destPath);
  }
}

myPackage();
