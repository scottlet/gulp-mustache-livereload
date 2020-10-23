const CONSTS = require('../CONSTS');

const nodeNotify = require('node-notifier');
const i18n2 = require('i18n-2');

const staticHelpers = {
    uc: str => {
        return str.toUpperCase();
    },
    capitalise: () => {
        return (str, render) => {
            return render(str).toUpperCase();
        };
    },
    lc: () => {
        return (str, render) => {
            return render(str).toLowerCase();
        };
    },
    str: () => {
        return (num, render) => {
            return render(num) + '';
        };
    },
    inc: () => {
        return (num, render) => {
            return parseInt(render(num)) + 1;
        };
    },
    hostname() {
        return CONSTS.HOST;
    },
    hostpath() {
        return CONSTS.PATH;
    },
    production() {
        return CONSTS.NODE_ENV === 'production';
    },
    version: CONSTS.VERSION
};

let errorShown;

function imagePathBuilder(locale) {
    const builder = pathBuilder(locale);

    return (assetPath, data) => {
        assetPath = 'images/' + assetPath;

        return builder(assetPath, data);
    };
}

function pathBuilder(locale) {
    return () => {
        return function (text, render) {
            if (text.charAt(0) !== '/') {
                return '/' + CONSTS.VERSION + '/' + render(text);
            }

            return '/' + CONSTS.VERSION + render(text);
        };
    };
}

function getStem(path) {
    return path.split('/')[path.split('/').length - 1].split('.')[0];
}

function renameFile(path) {
    if (path.extname) {
        path.extname = '.html';
    }
}

function errorHandler(error) {
    if (!errorShown) {
        nodeNotify.notify({
            message: 'Error: ' + error.message,
            title: 'Gulp HTML Build',
            onLast: true
        });
        errorShown = true;
        console.error(error.name, error.message, error.fileName, error.plugin); //eslint-disable-line no-console
    }
}

function setErrorShown(bool) {
    errorShown = bool;
}

function getStaticHelpers() {
    return staticHelpers;
}

function getDynamicHelpers(locale) {
    const i18n = new i18n2({
        locales: CONSTS.LANGS,
        defaultLocale: 'en',
        extension: '.json',
        directory: './src/i18n',
        indent: '    ',
        dump: () => {
            throw 'error';
        }
    });

    const options = {
        day: 'numeric',
        year: 'numeric',
        month: 'short'
    };

    function trans(text) { //eslint-disable-line
        let desktop = i18n.__(text); //eslint-disable-line
        let mobile = i18n.__(text + '_mobile'); //eslint-disable-line

        if (mobile.replace(/_mobile/gi, '') !== text) {
            return `
            <span class="ln-desktop">${desktop}</span>
            <span class="ln-mobile">${mobile}</span>
            `;
        }

        return desktop;
    }

    function ntrans(one, other, count) { //eslint-disable-line
        return i18n.__n(one, other, count); //eslint-disable-line
    }

    i18n.setLocale(locale);

    const rets = {
        locale,
        getLocaleStr: () => {
            return locale;
        },
        getLocale: () => {
            return locale === 'en' ? '/' : '/de/';
        },
        path: pathBuilder(locale),
        imagepath: imagePathBuilder(locale),
        buildDate: new Date().toLocaleTimeString(locale, options),
        __: () => {
            return (text, render) => {
                return render(trans(text));
            };
        },
        __n: ntrans
    };

    rets[locale] = true;

    return rets;
}

module.exports = {
    getStaticHelpers,
    errorHandler,
    renameFile,
    getStem,
    imagePathBuilder,
    pathBuilder,
    setErrorShown,
    getDynamicHelpers
};
