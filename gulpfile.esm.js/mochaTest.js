// const { src } = require('gulp');
// const gulpNotify = require('gulp-notify');
// const gulpPlumber = require('gulp-plumber');
// const gulpSpawnMocha = require('gulp-spawn-mocha');
// const gulpWait = require('gulp-wait');

import { src } from 'gulp';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import gulpSpawnMocha from 'gulp-spawn-mocha';
import gulpWait from 'gulp-wait';
import { CONSTS } from './CONSTS';

const { TESTS_PATH } = CONSTS;

const TEST_DELAY = 3050;

const mochaOptions = {
  require: ['esm'],
  R: 'nyan'
};

/**
 * Runs the Mocha test suite with live reloading.
 * @returns {NodeJS.ReadWriteStream} The stream of the Mocha test suite.
 */
function mochaTestLR() {
  return src(TESTS_PATH + '**/*.js', { read: false })
    .pipe(gulpWait(TEST_DELAY))
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpSpawnMocha(mochaOptions));
}

/**
 * Runs the Mocha test suite and handles any errors that occur.
 * @returns {NodeJS.ReadWriteStream} The stream of the Mocha test suite.
 */
function mochaTest() {
  return src(TESTS_PATH + '**/*.js', { read: false })
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpSpawnMocha(mochaOptions));
}

export { mochaTest, mochaTestLR };
