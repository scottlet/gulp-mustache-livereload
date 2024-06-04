import { CONSTS } from '../../CONSTS';

const { HOST, PATH, NODE_ENV, NAME, VERSION } = CONSTS;

const staticHelpers = {
  uc: (/** @type {string} */ str) => {
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

/**
 * Returns the static helpers object.
 * @returns {object} The static helpers object.
 */
export function getStaticHelpers() {
  return staticHelpers;
}
