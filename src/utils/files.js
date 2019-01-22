const fsP = require('fs').promises;
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Resolve a path even if is using shell specific for home
 * @param  {String} originalPath The path to resolve
 * @return {String}              The resolved path
 */
function resolvePath(originalPath) {
  let finalPath = '';

  if (os.platform() !== 'win32') {
    finalPath = originalPath.replace('~', os.homedir());
  }

  finalPath = path.resolve(finalPath);

  return finalPath;
}

/**
 * Read a file and translate to json
 * @param  {String} file The path to the file
 * @return {Promise}     The json object from the file
 */
async function readJsonFile(file) {
  let json;

  return new Promise((resolve, reject) => {
    fs.readFile(resolvePath(file), 'utf8', (err, data) => {
      if (err) reject(err);
      json = JSON.parse(data);
      resolve(json);
    });
  });
}

/**
 * Copy a folder recursively
 * @param  {String} [currentPath='./']   The folder path to copy
 * @param  {String} [destPath='../new']  The destination path
 */
async function copyDirRecursive(currentPath = './', destPath = '../new') {
  let dest = resolvePath(destPath);
  const current = resolvePath(currentPath);

  // Create the dest folder
  fsP.access(dest)
    .catch(async () => {
      await fsP.mkdir(dest, { recursive: true });
      console.log(`Folder ${dest} created`);
    });

  // Read files in folder
  const files = await fsP.readdir(current);

  for(file of files) {
    src = resolvePath(path.join(current, file));
    dest = resolvePath(path.join(destPath, file));

    srcObj = await fsP.lstat(src);
    if (srcObj.isDirectory()) {
      // Recursive copy for folders
      await copyDirRecursive(src, dest);
    } else {
      // Copy file
      await fsP.copyFile(src, dest);
      console.log(`File ${file} copied`);
    }
  }

  // const promises = files.map(file => new Promise(async () => {
  //   const src = resolvePath(path.join(current, file));
  //   dest = resolvePath(path.join(destPath, file));
  //
  //   const srcObj = await fsP.lstat(src);
  //   if (srcObj.isDirectory()) {
  //     // Recursive copy for folders
  //     await copyDirRecursive(src, dest);
  //   } else {
  //     // Copy file
  //     await fsP.copyFile(src, dest);
  //     console.log(`File ${file} copied`);
  //   }
  // }));
  //
  // await Promise.all(promises);
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
    console.log(`Folder ${dirPath} deleted`);
  } else {
    console.error(`Folder ${dirPath} not deleted: Not found`);
  }
}

module.exports = {
  copyDirRecursive,
  deleteDirRecursive,
  resolvePath,
  readJsonFile,
};
