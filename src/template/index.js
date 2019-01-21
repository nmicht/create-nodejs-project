const fs = require('fs');

const utils = require('../utils');

/**
 * Update a file using a dictionary
 * @param  {Object} dictionary    A key-value dictionary
 * @param  {String} [filePath=''] The path for the file
 */
function updateFile(dictionary, filePath = '') {
  const resolvedFilePath = utils.files.resolvePath(filePath);
  let originalFile;

  try {
    originalFile = fs.readFileSync(resolvedFilePath, 'utf8');
  } catch (error) {
    throw error;
  }

  const generatedFile = utils.string.replaceByDictionary(originalFile, dictionary);

  fs.writeFile(resolvedFilePath, generatedFile, (err) => {
    if (err) {
      throw err;
    }
    console.log(`File ${resolvedFilePath} updated`);
  });
}

/**
 * Copy the template folder recursively
 * @param  {String} templatePath The template path
 * @param  {String} destPath     The destination
 */
function copy(templatePath, destPath) {
  utils.files.copyDirRecursive(templatePath, destPath);
}

module.exports = {
  updateFile,
  copy,
};
