import { src, dest } from 'gulp';
import mustache from 'gulp-mustache';
import merge2 from 'merge2';
import gulpPlumber from 'gulp-plumber';
import { errorHandler, getStem, setErrorShown, getDynamicHelpers, getStaticHelpers } from './template-helpers';
import gulpLivereload from 'gulp-livereload';
import through2 from 'through2';
import { CONSTS } from '../CONSTS';

// gulp.src('./templates/*.mustache')
//     .pipe(mustache())
//     .pipe(gulp.dest('./dist'));

function buildFiles(file, _enc, callback) {
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

export { buildMustache };
