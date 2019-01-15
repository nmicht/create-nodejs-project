const utils = require('../utils');

async function userValue(prop) {
  let data = '';

  try {
    data = await utils.execp(`git config user.${prop}`);
  } catch (error) {
    console.error(error);
  }

  return data.trim();
}

async function init(path) {
  try {
    await utils.execp(`cd ${path} && git init`);
  } catch (error) {
    console.error(error);
  }
}

async function commit(path, msg = 'Initial commit') {
  try {
    await utils.execp(`cd ${path} && git add . && git commit -m'${msg}'`);
  } catch (error) {
    console.error(error);
  }
}

async function addRemote(path, url, remote = 'origin') {
  try {
    await utils.execp(`cd ${path} && git remote add ${remote} ${url}`);
  } catch (error) {
    console.error(error);
  }
}

async function push(destPath, remote = 'origin', branch = 'master') {
  try {
    await utils.execp(`cd ${destPath} && git push ${remote} ${branch}`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  userValue,
  init,
  commit,
  addRemote,
  push,
};
