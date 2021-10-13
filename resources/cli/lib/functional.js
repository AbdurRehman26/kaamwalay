const composer = (...pipes) => {
    return (arg) => pipes.reduce((previousValue, pipe) => pipe(previousValue), arg);
};

module.exports.composer = composer;
module.exports.compose = (...pipes) => composer(...pipes)();
