const childProcess = require('child_process');

const cmd = childProcess.exec('yarn serve -p 3030');
cmd.stdout.pipe(process.stdout);
cmd.stderr.pipe(process.stderr);
