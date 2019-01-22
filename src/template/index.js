const fs = require('fs').promises;

const utils = require('../utils');

/**
 * Update a file using a dictionary
 * @param  {Object} dictionary    A key-value dictionary
 * @param  {String} [filePath=''] The path for the file
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
 * @param  {String} templatePath The template path
 * @param  {String} destPath     The destination
 */
async function copy(templatePath, destPath) {
  await utils.files.copyDirRecursive(templatePath, destPath);
}

module.exports = {
  updateFile,
  copy,
};
