const path = require('path');

/**
 * Replace a string using a given dictionary
 * @param  {String} original   The string to be replaced
 * @param  {Object} dictionary A key-value dictionary
 * @return {String}            The string with the replacements
 */
function replaceByDictionary(original, dictionary) {
  let processed = original;

  for(key in dictionary){
    processed = processed.replace(key, dictionary[key]);
  }

  return processed;
}

/**
 * Create a normalized name based on the path
 * @param  {String} filepath The path
 * @return {String}          A name normalized without blank spaces all lowercase
 */
function normalizeName(filepath) {
  return path.basename(filepath).toLowerCase().replace(' ', '-');
}


module.exports = {
  replaceByDictionary,
  normalizeName,
};
