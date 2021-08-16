const { compose } = require('../lib/functional');
const { describe, command, handler, option, processPipes, executeCommand, stringCommand } = require('../lib/command');
const { env } = require('../lib/env');

module.exports = compose(
    command('start'),
    describe('Application start command'),
    option('watch', {
        type: 'boolean',
        default: true,
        describe: 'enable/disable watch',
    }),
    option('hot', {
        type: 'boolean',
        default: true,
        describe: 'enable/disable hot reload',
    }),
    handler(({ app, watch, hot }) => {
        const args = ['mix'];

        if (watch) {
            args.push('watch');
        }

        if (hot) {
            args.push('--hot');
        }

        compose(env('BUILD_PRESET', app), stringCommand(...args), executeCommand(), processPipes());
    }),
);
