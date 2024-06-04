import { src, dest } from 'gulp';
import mustache from 'gulp-mustache';
import gulpPlumber from 'gulp-plumber';
import {
  errorHandler,
  getStem,
  setErrorShown,
  getDynamicHelpers,
  getStaticHelpers
} from './template-helpers';
import gulpLivereload from 'gulp-livereload';
import through2 from 'through2';
import { CONSTS } from '../CONSTS';

const { LIVERELOAD_PORT } = CONSTS;

/**
 * Builds the HTML files based on the Mustache templates.
 * @param {object} file - The options object.
 * @param {string} file.path - The path of the file being processed.
 * @param {string} _enc - The encoding of the file.
 * @param {Function} callback - The callback function to be called when the build is finished.
 * @returns {void} A promise that resolves when the build is finished.
 */
function buildFiles({ path }, _enc, callback) {
  const locale = getStem(path);
  const finalPath = 'dist' + (locale === 'en' ? '' : '/' + locale);
  const dynamicHelpers = getDynamicHelpers(locale);
  const staticHelpers = getStaticHelpers();

  const data = {
    path,
    ...staticHelpers,
    ...dynamicHelpers
  };

  src(`${CONSTS.TEMPLATES_SRC}/*.mustache`)
    .pipe(
      gulpPlumber({
        errorHandler
      })
    )

    .pipe(mustache(data, { extension: '.html' }, {}))
    .pipe(dest(finalPath))
    .pipe(gulpLivereload({ port: LIVERELOAD_PORT }));

  callback();
}

/**
 * Builds the Mustache templates by processing the JSON files in the './src/i18n/' directory.
 * @returns {NodeJS.ReadWriteStream} A stream of the processed Mustache templates.
 */
function buildMustache() {
  setErrorShown(false);

  return src(['./src/i18n/*.json'])
    .pipe(
      gulpPlumber({
        errorHandler
      })
    )
    .pipe(through2.obj(buildFiles));
}

export { buildMustache };
