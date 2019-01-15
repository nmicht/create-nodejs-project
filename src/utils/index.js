const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function propertyByPlaceholder(placeholder) {
  let words = placeholder.split('_');
  if(words[0] === 'PROJECT') {
    words.shift();
  }
  return words.map(word => word.toLowerCase()).join('.');
}

function replaceByDictionary(original, dictionary) {
  for(key in dictionary){
    original = original.replace(key, dictionary[key]);
  }

  return original;
}

function copyDirRecursive(start = './', end = '../new') {
  let target = path.resolve(end);

  // Create the target folder
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
    console.log(`Folder created: ${target}`);
  }

  // Read files in folder
  let files = fs.readdirSync(start);
  for(file of files) {
    src = path.resolve(path.join(start, file));
    dest = path.resolve(path.join(end, file));

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

function execp(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        console.error('Is not possible to get the git information for the user name');
        reject(error);
      }
      resolve(stdout);
    });
  });
}

module.exports = {
  propertyByPlaceholder,
  replaceByDictionary,
  copyDirRecursive,
  execp,
};
