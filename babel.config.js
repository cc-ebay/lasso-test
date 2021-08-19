const chalk = require('chalk');
const d = {};

module.exports = (api) => {
    if (api && api.cache) api.cache(true);
    const presets = [];
    const plugins = [];

    const isDev = true;

    if (isDev) {
        presets.push([
            '@babel/env',
            {
                useBuiltIns: false,
                targets: {
                    // In dev we can use the last chrome
                    // so babel is a lot faster
                    chrome: 91
                },
                debug: true
            }
        ]);
    } else {
        presets.push([
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                // NOTE: This is the updated version of supported browser by eBay.
                //       It may be necessary adding something older because the resource server
                //       uses Google Closure that do not like some ES6 syntax (for example "{...args}")
                targets: require('@ebay/browserslist-config'),
                bugfixes: true
            }
        ]);

        plugins.push([
            '@babel/transform-runtime',
            {
                'absoluteRuntime': false,
                'helpers': true,
                'regenerator': true
            }
        ]);
    }

    return {
        'babelrc': false,
        'ignore': [
            '*.json',
            function(filename) {
                const ignore = false;//!!/node_modules[\\/](?!@ebay|@selling-ui[\\/]resell-bulk-drafts|@selling-ui[\\/]app-print-documents|lasso|@ngshell-ui|.*[\\/]node_modules)/.exec(filename);
                if (!ignore) {
                    d[filename] = d[filename] && d[filename] + 1 || 1;
                    if (d[filename] > 1) console.log('NOT IGNORED (', chalk.redBright(d[filename]), "times)", filename);
                }
                return ignore;
            },
        ],
        'presets': presets,
        'plugins': plugins
    };
};
