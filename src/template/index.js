const fs = require('fs').promises;
const path = require('path');

const utils = require('../utils');

/**
* Update a file using a dictionary
* @method updateFile
* @param  {Object} dictionary    A key-value dictionary
* @param  {String} [filePath=''] The path for the file
* @return {Promise}
*/
async function updateFile(dictionary, filePath = '') {
  const resolvedFilePath = utils.files.resolvePath(filePath);

  const originalFile = await fs.readFile(resolvedFilePath, 'utf8');

  const generatedFile = utils.string.replaceByDictionary(originalFile, dictionary);

  await fs.writeFile(resolvedFilePath, generatedFile);
  console.log(`File ${resolvedFilePath} updated`);
}

/**
* Copy the template folder recursively
* @method copyTemplate
* @param  {String} templatePath The template path
* @param  {String} destPath     The destination
* @return {Promise}
*/
async function copyTemplate(templatePath, destPath) {
  await utils.files.copyDirRecursive(templatePath, destPath);
}

/**
 * Read the license file, update its content with the project data and save it
 * on the new destination
 * @method copyLicense
 * @param  {String} license    The license name
 * @param  {Object} dictionary The dictionary used to update the license content
 * @param  {String} originPath The path for the licenses folder
 * @param  {String} destPath   The destination path
 * @return {Promise}
 */
async function copyLicense(license, dictionary, originPath, destPath) {
  // Get the license file
  const resolvedFilePath = path.join(originPath, license.replace(' ', '-'));
  const originalFile = await fs.readFile(resolvedFilePath, 'utf8');

  // Replace with dictionary
  const generatedFile = utils.string.replaceByDictionary(originalFile, dictionary);

  const licensePath = path.join(destPath, 'LICENSE');

  await fs.writeFile(licensePath, generatedFile);
  console.log(`File ${licensePath} created`);
}

/**
 * Update some of the template files with the project data
 * @method updateTemplateFiles
 * @param  {Object} dictionary The dictionary with the data to be updated on the
 * template files
 * @param  {String} destPath   The destination path
 * @return {Promise}
 */
function updateTemplateFiles(dictionary, destPath) {
  const readmePath = path.join(destPath, 'README.md');
  const packagePath = path.join(destPath, 'package.json');

  return Promise.all([
    updateFile(dictionary, readmePath),
    updateFile(dictionary, packagePath),
  ]);
}

/**
 * The template handler
 * @module template
 */
module.exports = {
  updateFile,
  copyTemplate,
  copyLicense,
  updateTemplateFiles,
};
