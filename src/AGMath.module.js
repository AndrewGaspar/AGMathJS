//if(typeof define !== 'function') {
//    define = require('amdefine')(module);
//}
//
//define(function(require) {
//   var AGMath = require('./AGMath.js');
//   
//   return function() { return AGMath; };
//});

var requirejs = require('requirejs'),
    EventEmitter = require('events').EventEmitter;

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

module.exports = requirejs('AGMath');