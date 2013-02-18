var requirejs = require('requirejs');

var config = {
    baseUrl: "./src",
    name: "AGMath",
    out: "./build/AGMath-built.js"
};

requirejs.optimize(config);