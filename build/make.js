var requirejs = require('requirejs');

var config = {
    baseUrl: "./src",
    name: "Math",
    out: "./build/Math-built.js"
};

requirejs.optimize(config, function (buildResponse) {
    console.log("hi");
    console.log(buildResponse);
    // buildResponse is text output of modulesl inlcuded
});