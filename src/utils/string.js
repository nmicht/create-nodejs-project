const path = require('path');

/**
 * Replace a string using a given dictionary
 * @param  {String} original   The string to be replaced
 * @param  {Object} dictionary A key-value dictionary
 * @return {String}            The string with the replacements
 */
function replaceByDictionary(original, dictionary) {
  // FIXME: no es buena practica modificar los valores originales de los parametros
  for(key in dictionary){
    original = original.replace(key, dictionary[key]);
  }

  return original;
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
