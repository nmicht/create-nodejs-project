const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Copy a folder recursively
 * @param  {String} [currentPath='./']   The folder path to copy
 * @param  {String} [destPath='../new'] The destination path
 */
function copyDirRecursive(currentPath = './', destPath = '../new') {
  const dest = path.resolve(destPath);

  // Create the dest folder
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
    console.log(`Folder created: ${dest}`);
  }

  // Read files in folder
  let files = fs.readdirSync(currentPath);
  for(file of files) {
    src = path.resolve(path.join(currentPath, file));
    dest = path.resolve(path.join(destPath, file));

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

/**
 * Promisified exec
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @param  {String} cmd  The commando to be executed
 * @return {Promise}     Promise object represents the exec of command
 */
function execp(cmd) {
  // TODO look for a way to get the stdio piped directly but also get the final stdio to use it on resolve
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        console.error(`There was an error with the command: ${cmd}`);
        reject(error);
      }
      resolve(stdout);
    });
  });
}

module.exports = {
  replaceByDictionary,
  copyDirRecursive,
  execp,
};
