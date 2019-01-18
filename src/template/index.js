const fs = require('fs');

const utils = require('../utils');

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

function copy(templatePath, destPath) {
  utils.fs.copyDirRecursive(templatePath, destPath);
}

module.exports = {
  updateFile,
  copy,
};
