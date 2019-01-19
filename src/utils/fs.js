/** In general on this file, you can considerate move this to be async **/
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Resolve a path even if is using shell specific for home
 * @param  {String} oPath The path to resolve
 * @return {String}       The resolved path
 */
function resolvePath(oPath) {
  let fPath = '';
  fPath = oPath.replace('~', os.homedir());
  fPath = path.resolve(fPath);
  return fPath;
}


/**
 * Copy a folder recursively
 * @param  {String} [currentPath='./']   The folder path to copy
 * @param  {String} [destPath='../new'] The destination path
 */
function copyDirRecursive(currentPath = './', destPath = '../new') {
  let dest = resolvePath(destPath);
  const current = resolvePath(currentPath);

  // Create the dest folder
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
    console.log(`Folder created: ${dest}`);
  }

  // Read files in folder
  const files = fs.readdirSync(current);

  for(file of files) {
    src = resolvePath(path.join(current, file));
    dest = resolvePath(path.join(destPath, file));

    if (fs.lstatSync(src).isDirectory()) {
      // Recursive copy for folders
      copyDirRecursive(src, dest);
    } else {
      // Copy file
      fs.copyFileSync(src, dest);
      console.log(`File copied: ${file}`);
    }
  }
}

function deleteDirRecursive(folderPath) {
  const dirPath = resolvePath(folderPath);

  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = resolvePath(path.join(dirPath, file));
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteDirRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`Dir ${dirPath} deleted`);
  } else {
    console.error(`Dir not deleted: ${dirPath} not found`);
  }
}

module.exports = {
  copyDirRecursive,
  deleteDirRecursive,
  resolvePath,
};
