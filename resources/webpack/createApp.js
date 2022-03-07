const path = require('path');
const fs = require('fs');
const mix = require('laravel-mix');
const convertToFileHash = require('laravel-mix-make-file-hash');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const tailwindcss = require('tailwindcss');

const baseDir = path.resolve(__dirname, '../..');

function resolveEntry(entry) {
    return fs.existsSync(path.resolve(baseDir, entry));
}

module.exports.createApp = function createApp(name) {
    const appUrl = `apps/${name}`;
    const appPath = `public/${appUrl}`;

    function extendWebpack(webpackConfig) {
        webpackConfig.module.rules[1].use[0].options.publicPath = `/apps/${name}`;
        webpackConfig.module.rules[1].test = /\.(png|jpe?g|gif|webp|mp4)$/;
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
            // Needed for web3js
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',
            }),
        );

        // Fixes to get web3js to work
        webpackConfig.resolve.fallback = {
            ...webpackConfig.resolve.fallback,
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            os: require.resolve('os-browserify/browser'),
            url: require.resolve('url'),
            assert: require.resolve('assert'),
        };

        if (process.env.ANALYZE_WEBPACK) {
            webpackConfig.plugins.push(new BundleAnalyzerPlugin());
        }
    }

    const jsEntry = [
        `resources/ts/${name}/index.tsx`,
        `resources/ts/${name}/index.ts`,
        `resources/ts/${name}/main.ts`,
    ].find(resolveEntry);

    const cssEntry = [`resources/style/${name}/app.scss`, `resources/style/${name}/app.css`].find(resolveEntry);

    if (cssEntry) {
        const isCss = /\.css$/.test(cssEntry);
        const tailwindConfig = tailwindcss('./tailwind.config.js');

        if (isCss) {
            mix.postCss(cssEntry, '', [tailwindConfig]);
        } else {
            mix.sass(cssEntry, '', {}, [tailwindConfig]);
        }
    }

    // noinspection JSUnresolvedFunction
    mix.setPublicPath(appPath)
        .ts(jsEntry, '')
        .react()
        .extract()
        .browserSync(process.env.APP_URL || 'http://robograding.test')
        .options({
            watchOptions: {
                ignored: /node_modules/,
            },
            processCssUrls: false,
        })
        .override(extendWebpack)
        .alias({
            '@shared': path.join(__dirname, '../ts/shared'),
            '@publicPath': path.join(__dirname, '../ts/shared/publicPath.ts'),
            [`@${name}`]: path.join(__dirname, `../ts/${name}`),
        })
        .sourceMaps()
        .disableNotifications();

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
