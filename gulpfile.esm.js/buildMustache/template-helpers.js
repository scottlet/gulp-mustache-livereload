import nodeNotify from 'node-notifier';
import { CONSTS } from '../CONSTS';
import i18n2 from 'i18n-2';
import { HttpError } from 'http-errors';

const { LANGS, HOST, PATH, NODE_ENV, NAME, VERSION } = CONSTS;

const staticHelpers = {
  uc: str => {
    return str.toUpperCase();
  },
  capitalise: () => {
    return (
      /** @type {any} */ str,
      /** @type {(arg0: any) => string} */ render
    ) => {
      return render(str).toUpperCase();
    };
  },
  lc: () => {
    return (
      /** @type {any} */ str,
      /** @type {(arg0: any) => string} */ render
    ) => {
      return render(str).toLowerCase();
    };
  },
  str: () => {
    return (
      /** @type {any} */ num,
      /** @type {(arg0: any) => string} */ render
    ) => {
      return render(num) + '';
    };
  },
  inc: () => {
    return (
      /** @type {any} */ num,
      /** @type {(arg0: any) => string} */ render
    ) => {
      return parseInt(render(num)) + 1;
    };
  },
  hostname() {
    return HOST;
  },
  hostpath() {
    return PATH;
  },
  production() {
    return NODE_ENV === 'production';
  },
  name: NAME.replace(/ /gi, '-').toLowerCase(),
  version: () => VERSION,
  datestamp: () => Date.now()
};

console.log('OUR VERSION IS', VERSION);

let errorShown;

/**
 * Returns a function that builds a path based on the given locale.
 * @param {string} locale - The locale to build the path for.
 * @returns {Function} A function that takes a text and a render function as parameters, and returns a formatted path.
 */
function pathBuilder(locale) {
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
function imagePathBuilder(locale) {
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
function getStem(path) {
  return path.split('/')[path.split('/').length - 1].split('.')[0];
}

/**
 * Renames the file extension of a given path to ".html".
 * @param {object} path - The path object to be modified.
 * @returns {void} This function does not return a value.
 */
function renameFile(path) {
  if (path.extname) {
    path.extname = '.html';
  }
}

/**
 * Handles errors that occur during the Gulp HTML build process.
 * @param {HttpError} error - The error object that occurred.
 * @returns {void} This function does not return a value.
 */
function errorHandler(error) {
  if (!errorShown) {
    nodeNotify.notify({
      message: 'Error: ' + error.message,
      title: 'Gulp HTML Build'
    });
    errorShown = true;
    console.error(error.name, error.message, error.fileName, error.plugin); //eslint-disable-line no-console
  }
}

/**
 * Sets the value of the `errorShown` variable to the provided boolean value.
 * @param {boolean} bool - The boolean value to set `errorShown` to.
 * @returns {void} This function does not return a value.
 */
function setErrorShown(bool) {
  errorShown = bool;
}

/**
 * Returns the static helpers object.
 * @returns {object} The static helpers object.
 */
function getStaticHelpers() {
  return staticHelpers;
}

/**
 * Returns an object containing dynamic helpers for the specified locale.
 * @param {string} locale - The locale for which to generate the helpers.
 * @returns {object} An object containing the following dynamic helpers:
 *   - locale: The specified locale.
 *   - getLocaleStr: A function that returns the specified locale as a string.
 *   - getLocale: A function that returns the corresponding URL path for the
 *     specified locale.
 *   - path: A function that returns the URL path for a specified file and
 *     locale.
 *   - imagepath: A function that returns the URL path for an image file and
 *     locale.
 *   - buildDate: A string representing the current date and time in the
 *     specified locale.
 *   - __: A function that translates a text string into the specified locale.
 *   - __n: A function that translates a pluralized text string into the
 *     specified locale.
 */
function getDynamicHelpers(locale) {
  const i18n = new i18n2({
    locales: LANGS,
    defaultLocale: 'en',
    extension: '.json',
    directory: './src/i18n',
    indent: '    ',
    dump: () => {
      throw 'error';
    }
  });

  const options = {
    day: 'numeric',
    year: 'numeric',
    month: 'short'
  };

  /**
   * Translates a given text into the specified locale.
   * @param {string} text - The text to be translated.
   * @returns {string} The translated text, with an optional mobile-specific translation.
   */
  function trans(text) {
    //eslint-disable-line
    let desktop = i18n.__(text); //eslint-disable-line
    let mobile = i18n.__(text + '_mobile'); //eslint-disable-line

    if (mobile.replace(/_mobile/gi, '') !== text) {
      return `
            <span class="ln-desktop">${desktop}</span>
            <span class="ln-mobile">${mobile}</span>
            `;
    }

    return desktop;
  }

  /**
   * Translates a pluralized text string into the specified locale.
   * @param {string} one - The singular form of the text string.
   * @param {string} other - The plural form of the text string.
   * @param {number} count - The number used to determine which form of the text string to use.
   * @returns {string} The translated text string.
   */
  function ntrans(one, other, count) {
    //eslint-disable-line
    return i18n.__n(one, other, count); //eslint-disable-line
  }

  i18n.setLocale(locale);

  const rets = {
    locale,
    getLocaleStr: () => {
      return locale;
    },
    getLocale: () => {
      return locale === 'en' ? '/' : '/de/';
    },
    path: pathBuilder(locale),
    imagepath: imagePathBuilder(locale),
    // @ts-ignore
    buildDate: new Date().toLocaleTimeString(locale, options),
    __: () => {
      return (text, render) => {
        return render(trans(text));
      };
    },
    __n: ntrans
  };

  rets[locale] = true;

  return rets;
}

export {
  getStaticHelpers,
  errorHandler,
  renameFile,
  getStem,
  imagePathBuilder,
  pathBuilder,
  setErrorShown,
  getDynamicHelpers
};
