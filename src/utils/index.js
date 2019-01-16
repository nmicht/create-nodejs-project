const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Replace a string using a given dictionary
 * @param  {String} original   The string to be replaced
 * @param  {Object} dictionary A key-value dictionary
 * @return {String}            The string with the replacements
 */
function replaceByDictionary(original, dictionary) {
  for(key in dictionary){
    original = original.replace(key, dictionary[key]);
  }

  return original;
}

/**
 * Copy a folder recursively
 * @param  {String} [currentPath='./']   The folder path to copy
 * @param  {String} [destPath='../new'] The destination path
 */
function copyDirRecursive(currentPath = './', destPath = '../new') {
  let dest = path.resolve(destPath);

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

/**
 * Promisified spawn
 * @param  {[type]} command  command name
 * @param  {[type]} args     command arguments
 * @param  {[type]} cwd      working directory to run the commad
 */
async function spawnp(command, args, cwd) {
  const proc = spawn(command, args, {
    stdio: 'inherit',

    // TODO: use https://github.com/chjj/pty.js to provide a psuedo-TTY for capturing real-time npm output
    cwd,
  });

  await new Promise((resolve, reject) => {
    proc.on('error', reject);
    proc.on('exit', (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(`"npm install" exited with status code ${exitCode}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  replaceByDictionary,
  copyDirRecursive,
  execp,
  spawnp,
};
