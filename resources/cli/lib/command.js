const path = require('path');
const childProcess = require('child_process');
const chalk = require('chalk');

module.exports.aliases = (aliases) => (object) => ({ ...object, aliases });
module.exports.builder = (builder) => (object) => ({ ...object, builder });
module.exports.command = (command) => (object) => ({ ...object, command });
module.exports.deprecated = (deprecated) => (object) => ({ ...object, deprecated });
module.exports.describe = (describe) => (object) => ({ ...object, describe });
module.exports.handler = (handler) => (object) => ({ ...object, handler });

/**
 *
 * @param name
 * @param {import('yargs').PositionalOptions} options
 */
module.exports.option =
    (name, options) =>
    /**
     * @param {import('yargs').Argv} object
     */
    (object) => {
        if (object.option) {
            return object.option(name, options);
        }

        return {
            ...object,
            builder: (app) => (object.builder ? object.builder(app) : app).option(name, options),
        };
    };

module.exports.registerCommand = (commandPath) => (app) => {
    return app.command(require(path.resolve(__dirname, '..', 'commands', commandPath)));
};

module.exports.stringCommand = (...args) => {
    return (cmd) => [cmd ?? '', ...args].join(' ');
};

module.exports.executeCommand = (cmd) => (prevCmd) => {
    cmd = cmd || prevCmd;
    console.log(chalk.grey(`$ ${cmd}`));
    return childProcess.exec(cmd);
};

module.exports.processPipes = () => (cmd) => {
    cmd.stdin.pipe(process.stdin);
    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);
    return cmd;
};
