const path = require('path');
const mix = require('laravel-mix');
const convertToFileHash = require('laravel-mix-make-file-hash');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports.createApp = function createApp(name) {
    const appPath = `public/apps/${name}`;

    function extendWebpack(webpackConfig) {
        webpackConfig.module.rules[1].use[0].options.publicPath = `/apps/${name}`;
        webpackConfig.module.rules[1].test = /\.(png|jpe?g|gif|webp)$/;
        webpackConfig.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader'],
        });

        webpackConfig.plugins.push(
            new LodashModuleReplacementPlugin(),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
        );

        if (process.env.ANALYZE_WEBPACK) {
            webpackConfig.plugins.push(new BundleAnalyzerPlugin());
        }
    }

    // noinspection JSUnresolvedFunction
    mix.setPublicPath(appPath)
        .ts(`resources/ts/${name}/index.tsx`, '')
        .react()
        .extract()
        .browserSync(process.env.APP_URL || 'http://laravel.test')
        .override(extendWebpack)
        .alias({
            '@shared': path.join(__dirname, '../ts/shared'),
            '@publicPath': path.join(__dirname, '../ts/shared/publicPath.ts'),
            [`@${name}`]: path.join(__dirname, `../ts/${name}`),
        })
        .sourceMaps(false);

    if (mix.inProduction()) {
        mix.version();
        mix.then(async () => {
            await convertToFileHash({
                publicPath: appPath,
                manifestFilePath: `${appPath}/mix-manifest.json`,
            });
        });
    }

    return mix;
};
