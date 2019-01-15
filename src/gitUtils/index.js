const utils = require('../utils');

async function gitUserValue(prop) {
  let data = '';

  try {
    data = await utils.execp(`git config user.${prop}`);
  } catch (error) {
    console.error(error);
  }

  return data.trim();
}


module.exports = {
  gitUserValue,
};
