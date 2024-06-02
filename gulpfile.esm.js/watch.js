import fancyLog from 'fancy-log';
import { buildMustache } from './buildMustache';
import { doc } from './doc';
import { eslint } from './eslint';
import { sass } from './sass';
import { copyStaticFiles } from './copy';
import { mochaTestLR } from './mochaTest';
import { parallel, watch } from 'gulp';
import gulpLivereload from 'gulp-livereload';
import { CONSTS } from './CONSTS';

const PUBLIC = [
  CONSTS.IMG_SRC + '/**/!(*.svg)',
  CONSTS.FONT_SRC + '/**/*',
  CONSTS.JSON_SRC + '/**/*'
];
const SASS = [CONSTS.CSS_SRC_PATH + '/**/*', CONSTS.IMG_SRC + '/**/*.svg'];
const DATA = [CONSTS.DATA_SRC + '/**/*.json', CONSTS.I18N + '/**/*.json'];
const JS = ['src/**/*.js'];
const TEMPLATES = [CONSTS.TEMPLATES_SRC + '**/*.mustache'];

/**
 * Watches for changes in various directories and triggers corresponding tasks.
 * @param {Function} cb - The callback function to be called
 * @returns {void}
 */
function watchers(cb) {
  gulpLivereload.listen({
    port: CONSTS.LIVERELOAD_PORT
  });
  const watchPublic = watch(PUBLIC, copyStaticFiles);
  const watchSass = watch(SASS, sass);
  const watchTemplates = watch(TEMPLATES, buildMustache);
  const watchData = watch(DATA, buildMustache);
  const watchTests = watch(CONSTS.JS_SRC + '**/*-test.js', mochaTestLR);
  const watchDocs = watch(JS, parallel(doc, eslint));
  const watchPackages = watch('./package.json', buildMustache);

  [
    watchPublic,
    watchSass,
    watchData,
    watchDocs,
    watchTemplates,
    watchTests,
    watchPackages
  ].forEach(w => {
    w.on('change', function (path) {
      fancyLog(`file ${path} was changed. Triggered by ${this.name} watcher.`);
    });
  });
  cb();
}

export { watchers as watch };
