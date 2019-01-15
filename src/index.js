const path = require('path');
const lodash = require('lodash');
const fs = require('fs');
const { exec } = require('child_process');

const Project = require('./project');
const utils = require('./utils')

// First arg = path
const destPath = path.resolve(process.argv[2]);

// Get the other args
let options = process.argv[3];
// console.log(process.argv[2], options);

// - use defaults
// - do questions
// - avoid things?

// Create project object
let project = new Project({
  name: lodash.last(destPath.split(path.sep)).toLowerCase(),
});

// Create folder
// TODO if the folder is already in place, this will fail
fs.mkdir(destPath, (err) => {
  if (err) throw err;
});

// Initialize git
exec(`cd ${destPath} && git init`, (error) => {
  if (error) {
    console.error('Is not possible to initialize a git repo');
  }
});

// Create github repository

// Copy template files
utils.copyDirRecursive('template', destPath);

// Update package.json with project data
let originalFile = fs.readFileSync('./template/package.json', 'utf8', (err, data) => {
  if (err) throw err;
  return data;
});
let generatedFile = utils.replaceByDictionary(originalFile, project.dictionary);
fs.writeFile(`${destPath}/package.json`, generatedFile, (err) => {
  if (err) throw err;
  console.log('File updated: package.json');
});

// Update readme with project data
originalFile = fs.readFileSync('./template/README.md', 'utf8', (err, data) => {
  if (err) throw err;
  return data;
});
generatedFile = utils.replaceByDictionary(originalFile, project.dictionary);
fs.writeFile(`${destPath}/README.md`, generatedFile, (err) => {
  if (err) throw err;
  console.log('File updated: README.md');
});

// Install devDependencies
// TODO Make dependencies dynamic
console.log('Installing dev dependencies...');
let installDependencies = exec(`cd ${destPath} && npm install eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react jest`, (error) => {
  if (error) {
    console.error('There was an error with the devDependencies');
    throw error;
  }
});

installDependencies.stdout.pipe(process.stdout);
