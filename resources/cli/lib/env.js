module.exports.env = (key, value) => (cmd) => {
    cmd = cmd || '';
    if (!/^cross-env/.test(cmd)) {
        cmd = `cross-env ${cmd}`;
    }

    return cmd.replace(/^(cross-env)\s/, `$1 ${key}=${value}`);
};
