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
  fs.readdir(start, (err, files) => {
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
  });
}

module.exports = {
  propertyByPlaceholder,
  replaceByDictionary,
  copyDirRecursive,
};
