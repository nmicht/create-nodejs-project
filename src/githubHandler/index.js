const fs = require('fs');
const path = require('path');
const os = require('os');

const utils = require('../utils');

async function getToken() {
  let auth = {};
  const authFile = path.resolve(path.join(os.homedir(), 'auth.json'));
  try {
    auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch (error) {
    throw error;
  }

  return auth.github.token;
}

async function create(name, isPrivate = false) {
  let token = '';

  try {
    token = await getToken();
  } catch (error) {
    throw error;
  }

  console.log('Creating github repository...\n');
  const cmd = `curl -w "%{http_code}" -H "Authorization: token ${token}" -d '{"name": "${name}", "private": ${isPrivate}}' https://api.github.com/user/repos`;
  let result;

  try {
    result = await utils.execp(cmd);
  } catch (error) {
    console.error(error);
    return false;
  }

  let json = result.substring(0, result.lastIndexOf('\n'));
  const statusCode = result.substring(result.lastIndexOf('\n'));

  try {
    json = JSON.parse(json);
  } catch (error) {
    return false;
  }

  console.log(json);

  if (statusCode !== 201) {
    console.error('Repository not created: ', json.errors[0].message);
    return false;
  }

  return json;
}

async function push(destPath, remote = 'origin', branch = 'master') {
  try {
    await utils.execp(`cd ${destPath} && git push ${remote} ${branch}`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  create,
  getToken,
  push,
};
