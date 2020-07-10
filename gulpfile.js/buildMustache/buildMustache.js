const mustache = require('gulp-mustache');
const merge2 = require('merge2');
const gulpPlumber = require('gulp-plumber');
const { errorHandler, getStem, setErrorShown, getDynamicHelpers, getStaticHelpers } = require('./template-helpers');
const gulpLivereload = require('gulp-livereload');
const through2 = require('through2');
const { src, dest } = require('gulp');
const CONSTS = require('../CONSTS');

// gulp.src('./templates/*.mustache')
//     .pipe(mustache())
//     .pipe(gulp.dest('./dist'));

function buildFiles(file, enc, callback) {
    const locale = getStem(file.path);
    const finalPath = 'dist' + (locale === 'en' ? '' : '/' + locale);
    const dynamicHelpers = getDynamicHelpers(locale);
    const staticHelpers = getStaticHelpers();

    const data = {
        ...file,
        ...staticHelpers,
        ...dynamicHelpers
    };

    const pages = src(`${CONSTS.TEMPLATES_SRC}/*.mustache`)
        .pipe(gulpPlumber({
            errorHandler
        }))

        .pipe(mustache(data, { extension: '.html' }, {}))
        .pipe(dest(finalPath))
        .pipe(gulpLivereload({ port: CONSTS.LIVERELOAD_PORT }));

    return merge2(pages).on('finish', callback);
}

function buildMustache() {
    setErrorShown(false);

    return src(['./src/i18n/*.json'])
        .pipe(gulpPlumber({
            errorHandler
        }))
        .pipe(through2.obj(buildFiles));
}

module.exports = buildMustache;
