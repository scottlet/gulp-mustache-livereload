import { CONSTS } from '../../CONSTS';

const { VERSION } = CONSTS;

/**
 * Returns a function that builds a path based on the given locale.
 * @param {string} locale - The locale to build the path for.
 * @returns {Function} A function that takes a text and a render function as parameters, and returns a formatted path.
 */
export function pathBuilder(locale) {
  return () => {
    return function (text, render) {
      if (text.charAt(0) !== '/') {
        return '/' + VERSION + '/' + render(text);
      }

      return '/' + VERSION + render(text);
    };
  };
}

/**
 * Returns a function that builds a path for an image based on the given locale.
 * @param {string} locale - The locale to build the image path for.
 * @returns {Function} A function that takes an asset path and data as parameters, and returns a formatted image path.
 */
export function imagePathBuilder(locale) {
  const builder = pathBuilder(locale);

  return (assetPath, data) => {
    assetPath = 'images/' + assetPath;

    return builder(assetPath, data);
  };
}

/**
 * Returns the stem of a file path.
 * @param {string} path - The file path.
 * @returns {string} The stem of the file path, which is the name of the file without the extension.
 */
export function getStem(path) {
  return path.split('/')[path.split('/').length - 1].split('.')[0];
}

/**
 * Renames the file extension of a given path to ".html".
 * @param {object} path - The path object to be modified.
 * @returns {void} This function does not return a value.
 */
export function renameFile(path) {
  if (path.extname) {
    path.extname = '.html';
  }
}
