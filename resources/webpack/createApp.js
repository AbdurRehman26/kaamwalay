const path = require('path');
const mix = require('laravel-mix');
const convertToFileHash = require('laravel-mix-make-file-hash');

require('laravel-mix-merge-manifest');

function extendWebpack(webpackConfig) {
    webpackConfig.module.rules[1].test = /\.(png|jpe?g|gif|webp)$/;
    webpackConfig.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
    });
}

module.exports.createApp = function createApp(name) {
    // noinspection JSUnresolvedFunction
    mix.ts(`resources/ts/${name}/index.tsx`, `public/apps/${name}`)
        .react()
        .extract()
        .browserSync(process.env.APP_URL || 'http://laravel.test')
        .override(extendWebpack)
        .alias({
            '@shared': path.join(__dirname, '../ts/shared'),
            [`@${name}`]: path.join(__dirname, `../ts/${name}`),
        })
        .sourceMaps(false)
        .mergeManifest();

    if (mix.inProduction()) {
        mix.version();
        mix.then(async () => {
            await convertToFileHash({
                publicPath: 'public',
                manifestFilePath: 'public/mix-manifest.json',
            });
        });
    }

    return mix;
};
