const { createApp, runApp, availableApps } = require('./lib/app');
const { option, registerCommand } = require('./lib/command');
const { compose } = require('./lib/functional');

compose(
    createApp('cli'),
    option('app', {
        alias: 'a',
        type: 'string',
        demandOption: true,
        choices: ['all', ...availableApps],
    }),
    registerCommand('build'),
    registerCommand('start'),
    runApp(),
);
