require("child_process").exec("npm install requirejs buster", function (error, stdout, stderr) {
    console.log('build stdout: ' + stdout);
    console.log('build stderr: ' + stderr);
    if (error !== null) {
        console.log('build exec error: ' + error);
    }
});