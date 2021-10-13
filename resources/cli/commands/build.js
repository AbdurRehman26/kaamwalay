const { availableApps } = require('../lib/app');
const { compose } = require('../lib/functional');
const { describe, command, handler, processPipes, executeCommand, stringCommand, option } = require('../lib/command');
const { env } = require('../lib/env');

module.exports = compose(
    command('build'),
    describe('Application build command'),
    option('mode', {
        type: 'string',
        default: 'dev',
        alias: 'm',
        choices: ['dev', 'development', 'prod', 'production'],
    }),
    handler(({ app, mode }) => {
        const args = [];
        if (/^(prod|production)$/i.test(mode)) {
            args.push('--production');
        }

        for (const appName of availableApps) {
            if (app === appName || app === 'all') {
                compose(
                    env('BUILD_PRESET', appName),
                    stringCommand('mix', 'build', ...args),
                    executeCommand(),
                    processPipes(),
                );
            }
        }
    }),
);
