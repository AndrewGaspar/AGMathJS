var requirejs = require('requirejs');

var config = {
    baseUrl: "./src",
    name: "Math",
    out: "./build/Math-built.js"
};

requirejs.optimize(config);