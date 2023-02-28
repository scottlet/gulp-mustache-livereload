// const {
//     brotli,
//     browserify,
//     buildMustache: { buildMustache },
//     clean,
//     copy: { copyStaticFiles, copyDeploy },
//     doc,
//     eslint,
//     gzip,
//     mochaTest: { mochaTest },
//     sass,
//     server,
//     watch
// } = require('require-dir')('.', { recurse: true, extensions: ['.js'] });

// const { parallel, series } = require('gulp');

// const build = series(
//     clean,
//     parallel(
//         eslint,
//         doc,
//         copyStaticFiles,
//         series(buildMustache, browserify),
//         mochaTest,
//         sass
//     )
// );

// const handlebars = series(
//     buildMustache
// );

// module.exports = {
//     browserify,
//     buildMustache,
//     default: series(build, parallel(watch, server)),
//     deploy: series(build, copyDeploy, parallel(brotli, gzip)),
//     handlebars,
//     server
// };

const build = series(
    clean,
    parallel(
        eslint,
        doc,
        copyStaticFiles,
        series(buildMustache, browserify),
        mochaTest,
        sass
    )
);

const handlebars = series(buildMustache);
const compress = parallel(brotli, gzip);

const defaultTask = series(build, parallel(watch, server));
const deployTask = series(build, copyDeploy, compress);

import { series, parallel } from 'gulp';

import { browserify } from './browserify';
import { clean } from './clean';
import { copyStaticFiles, copyDeploy } from './copy';
import { brotli } from './brotli';
import { gzip } from './gzip';
import { doc } from './doc';

import { eslint } from './eslint';
import { mochaTest } from './mochaTest';
import { sass } from './sass';
import { server } from './server';
import { watch } from './watch';
import { buildMustache } from './buildMustache';

export {
    browserify,
    buildMustache,
    compress,
    copyStaticFiles as copy,
    defaultTask as default,
    deployTask as deploy,
    doc,
    eslint,
    handlebars,
    mochaTest,
    sass,
    server
};
