const {
    brotli,
    browserify,
    buildMustache: { buildMustache },
    clean,
    copy: { copyStaticFiles, copyDeploy },
    doc,
    eslint,
    gzip,
    mochaTest: { mochaTest },
    sass,
    server,
    watch
} = require('require-dir')('.', { recurse: true, extensions: ['.js'] });

const { parallel, series } = require('gulp');

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

const handlebars = series(
    buildMustache
);

module.exports = {
    browserify,
    buildMustache,
    default: series(build, parallel(watch, server)),
    deploy: series(build, copyDeploy, parallel(brotli, gzip)),
    handlebars,
    server
};
