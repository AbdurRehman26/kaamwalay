const path = require('path');
const mix = require('laravel-mix');
const convertToFileHash = require('laravel-mix-make-file-hash');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.ts('resources/ts/dashboard/index.tsx', 'public/apps/dashboard')
    .react()
    .extract()
    .browserSync(process.env.APP_URL || 'http://laravel.test')
    .override((webpackConfig) => {
        webpackConfig.module.rules[1].test = /\.(png|jpe?g|gif|webp)$/;
        webpackConfig.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader'],
        });
    })
    .alias({
        // Applications
        '@shared': path.join(__dirname, 'resources/ts/shared'),
        '@dashboard': path.join(__dirname, 'resources/ts/dashboard'),
    })
    .sourceMaps(false);

if (mix.inProduction()) {
    mix.version();
    mix.then(async () => {
        await convertToFileHash({
            publicPath: 'public',
            manifestFilePath: 'public/mix-manifest.json',
        });
    });
}
