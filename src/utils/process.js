const { exec, spawn } = require('child_process');

/**
 * Promisified exec
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @param  {String} cmd  The commando to be executed
 * @return {Promise}     Promise object represents the exec of command
 */
function execp(cmd, cwd = null) {
  return new Promise((resolve, reject) => {
    exec(cmd, {
      cwd,
    }, (error, stdout) => {
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
 * @param  {String} command  command name
 * @param  {string} args     command arguments
 * @param  {String} cwd      working directory to run the commad
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

module.exports = {
  execp,
  spawnp,
};
