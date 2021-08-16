const { createApp, runApp, availableApps } = require('./lib/app');
const { option, registerCommand } = require('./lib/command');
const { compose } = require('./lib/functional');

compose(
    createApp('cli'),
    option('app', {
        alias: 'a',
        type: 'string',
        default: 'all',
        choices: ['all', ...availableApps],
    }),
    registerCommand('build'),
    registerCommand('start'),
    runApp(),
);
