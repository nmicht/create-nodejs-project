const { exec, spawn } = require('child_process');

/**
 * Promisified exec
 * @method execp
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @param  {String} command  The command to be executed
 * @param  {String} cwd      The current working directoy where the the command
 * should be executed
 * @return {Promise}
 */
function execp(command, cwd = null) {
  return new Promise((resolve, reject) => {
    exec(command, {
      cwd,
    }, (error, stdout) => {
      if (error) {
        console.error(`There was an error with the command: ${command}`);
        reject(error);
      }
      resolve(stdout);
    });
  });
}

/**
 * Promisified spawn
 * @method spawnp
 * @param  {String} command  command name
 * @param  {string} args     command arguments
 * @param  {String} cwd      working directory to run the commad
 * @return {Promise}
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
        reject(new Error(`The command "${command} ${args.join(' ')}" exited with status code ${exitCode}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Utilities for processes
 * @module utils.process
 */
module.exports = {
  execp,
  spawnp,
};
