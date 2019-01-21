const fs = require('fs');
const inquirer = require('inquirer');

const utils = require('../src/utils');

async function install() {
  // FIXME: sería bueno almacenar ese archivo dentro de una carpeta que de contexto de tu modulo
  const authPath = utils.fs.resolvePath('~/auth.json');

  // no se pueden reutilizar las preguntas del cuestionario?
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'user',
      message: 'What is your github user?',
    },

    {
      type: 'input',
      name: 'token',
      message: 'What is your GitHub token?',
    },
  ]);

  // Write file
  const data = {
    github: [
      {
        user: answers.user,
        token: answers.token,
      },
    ],
  };

  fs.writeFileSync(authPath, JSON.stringify(data));
  console.log(`File ${authPath} created with your github details`);
}

install();
