import { src } from 'gulp';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import gulpMocha from 'gulp-mocha';
import { CONSTS } from './CONSTS';

const { SRC, GULPFILE } = CONSTS;

const mochaOptions = {
  require: ['esm'],
  reporter: 'spec'
};

if (process.env.NODE_ENV === 'production') {
  mochaOptions.reporter = 'nyan';
}

const TESTS_SRC = `${SRC}/**/*.test.js`;
const ALL_TESTS_SRC = [TESTS_SRC, `${GULPFILE}/**/*.test.js`];

/**
 * Runs the Mocha test suite with live reloading.
 * @returns {NodeJS.ReadWriteStream} The stream of the Mocha test suite.
 */
function mochaTestSrc() {
  return src(TESTS_SRC, { read: false })
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpMocha(mochaOptions));
}

/**
 * Runs the Mocha test suite and handles any errors that occur.
 * @returns {NodeJS.ReadWriteStream} The stream of the Mocha test suite.
 */
function mochaTest() {
  return src(ALL_TESTS_SRC, { read: false })
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpMocha(mochaOptions));
}

export { mochaTest, mochaTestSrc };
