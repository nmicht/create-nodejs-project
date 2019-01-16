const path = require('path');
const fs = require('fs');

const Project = require('./project');
const utils = require('./utils');
const gitHandler = require('./gitHandler');
const githubHandler = require('./githubHandler');
const questionnaire = require('./questionnaire');

async function myPackage() {
  // First arg = path
  const destPath = path.resolve(process.argv[2]);
  const projectFolder = utils.normalizeName(destPath);

  // TODO Include here a way to get "options" for the other args

  // Do not continue if the project folder already exists.
  if (fs.existsSync(destPath)) {
    throw new Error(`The project folder '${destPath} already exists. You need to specify a different path.`);
  }

  // Create folder
  try {
    fs.mkdirSync(destPath);
  } catch (error) {
    console.error('The folder project was not created. See details on the log');
    throw error;
  }

  // Questionnaire for the options
  const answers = await questionnaire.run(projectFolder);

  // Create project object
  const project = new Project(answers);

  // Setup git configuration values for the project object
  try {
    await project.initGitConfig();
  } catch (error) {
    console.error(error);
  }

  // Initialize git
  await gitHandler.init(destPath);

  // Create github repository and include properties to the project object
  const resp = await githubHandler.create(project.name, project.isPrivate);
  if (resp !== false) {
    console.log('Github repository created');
    project.git.httpUrl = resp.html_url;
    project.git.name = resp.name;
    project.git.sshUrl = resp.ssh_url;
    gitHandler.addRemote(destPath, project.git.sshUrl);
    project.hasRemote = true;
  }

  // Copy template files
  utils.copyDirRecursive('template', destPath);

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

  // Update package.json with project data
  let originalPackageFile;
  try {
    originalPackageFile = fs.readFileSync('./template/package.json', 'utf8');
  } catch (error) {
    throw error;
  }

  const generatedPackageFile = utils.replaceByDictionary(originalPackageFile, project.dictionary);
  // Change this to sync because dependencies depends on it
  fs.writeFile(`${destPath}/package.json`, generatedPackageFile, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log('File updated: package.json');
  });

  // Install devDependencies
  // TODO: update "engines" field in package.json
  // TODO Make dependencies dynamic
  // TODO make the stdout visible for npm process
  console.log('Installing dev dependencies...');
  await utils.spawnp(
    'npm',
    'install eslint eslint-plugin-node eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react'.split(' '),
    destPath,
  );

  // Commit and push
  await gitHandler.commit(destPath);

  if (project.hasRemote) {
    gitHandler.push(destPath);
  }
}

myPackage();
