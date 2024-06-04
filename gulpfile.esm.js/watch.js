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

const {
  IMG_SRC,
  FONT_SRC,
  JSON_SRC,
  CSS_SRC_PATH,
  DATA_SRC,
  I18N,
  TEMPLATES_SRC,
  LIVERELOAD_PORT
} = CONSTS;

const PUBLIC = [
  IMG_SRC + '/**/!(*.svg)',
  FONT_SRC + '/**/*',
  JSON_SRC + '/**/*'
];
const SASS = [CSS_SRC_PATH + '/**/*', IMG_SRC + '/**/*.svg'];
const DATA = [DATA_SRC + '/**/*.json', I18N + '/**/*.json'];
const JS = ['src/**/*.js'];
const TEMPLATES = [TEMPLATES_SRC + '**/*.mustache'];
const TESTS = '**/*.js';

/**
 * Watches for changes in various directories and triggers corresponding tasks.
 * @param {Function} cb - The callback function to be called
 * @returns {void}
 */
function watchers(cb) {
  gulpLivereload.listen({
    port: LIVERELOAD_PORT
  });
  const watchPublic = watch(PUBLIC, copyStaticFiles);
  const watchSass = watch(SASS, sass);
  const watchTemplates = watch(TEMPLATES, buildMustache);
  const watchData = watch(DATA, buildMustache);
  const watchTests = watch(TESTS, mochaTestLR);
  const watchDocs = watch(JS, parallel(doc, eslint));
  const watchPackages = watch('./package.json', buildMustache);

  [
    { label: 'watchPublic', watcher: watchPublic },
    { label: 'watchSass', watcher: watchSass },
    { label: 'watchData', watcher: watchData },
    { label: 'watchDocs', watcher: watchDocs },
    { label: 'watchTemplates', watcher: watchTemplates },
    { label: 'watchTests', watcher: watchTests },
    { label: 'watchPackages', watcher: watchPackages }
  ].forEach(w => {
    w.watcher.on('change', path => {
      fancyLog(`file ${path} was changed. Triggered by ${w.label} watcher.`);
    });
  });
  cb();
}

export { watchers as watch };
