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

module.exports = {
  userValue,
  init,
};
