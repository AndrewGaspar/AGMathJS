var exec = require("child_process").exec;

var setupDirs = ["./build", "./test"];

setupDirs.forEach(function (dir) {
    exec('node ./setup.js', {
        cwd: dir
    },
    function (error, stdout, stderr) {
        console.log('top stdout: ' + stdout);
        console.log('top stderr: ' + stderr);
        if (error !== null) {
            console.log('top exec error: ' + error);
        }
    });
});

