const fs = require('fs');

const utils = require('../utils');

/**
 * Update a file using a dictionary
 * @param  {String} [filePath=''] The path for the file
 * @param  {Object} dictionary    A key-value dictionary
 */
// FIXME: optional params to the right
function updateFile(filePath = '', dictionary) {
  const resolvedFilePath = utils.fs.resolvePath(filePath);
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
    console.log(`File updated: ${resolvedFilePath}`);
  });
}

/**
 * Copy the template folder recursively
 * @param  {String} templatePath The template path
 * @param  {String} destPath     The destination
 */
function copy(templatePath, destPath) {
  // FIXME: es confuso tener un modulo `utils.fs` y también usar 'fs'. Si tendrás tu propio utils.fs sería ideal abstraer el funcinamiento de fs
  utils.fs.copyDirRecursive(templatePath, destPath);
}

module.exports = {
  updateFile,
  copy,
};
