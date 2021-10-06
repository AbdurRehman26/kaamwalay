const yargs = require('yargs');

const createApp = (name) => () =>
    yargs
        .scriptName(name)
        .usage('$0 <command> [args]')
        .showHelpOnFail(true)
        .help()
        .demandCommand(1, '')
        .recommendCommands()
        .strict();

const runApp = () => (app) => app.argv;

module.exports.createApp = createApp;
module.exports.runApp = runApp;
module.exports.availableApps = ['admin', 'auth', 'dashboard', 'landings'];
