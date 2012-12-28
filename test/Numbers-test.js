/// <reference path="node_modules/requirejs/require.js" />

var buster = require("buster");

var requirejs = require("requirejs");
requirejs.config({
    baseUrl: "./src",
    nodeRequire: require
});

requirejs(["Numbers/JSNumber", "Matrix/Matrix"], function (JSNumber, Matrix) {
    buster.testCase("JSNumber Tests", {
        "simple addition": function () {
            var seven = new JSNumber(7);
            assert(seven.add(8).toNumber() === 15);
        }
    });

    buster.testCase("Matrix tests", {
        "true": function() {
            assert(true);
        },
        "determinant": function () {
            var matr = new Matrix(3, 3);

            matr.setMatrix(
                [
                    [-2, 2, 3],
                    [-1, 1, 3],
                    [2, 0, -1]
                ]
            );

            assert(matr.determinant().toNumber() === 6);
        },
        "determinant2": function() {
            var matr = new Matrix(3, 3);

            matr.setMatrix(
                [
                    [-2, 2, -3],
                    [-1, 1, 3],
                    [2, 0, -1]
                ]
            );

            assert(matr.determinant().toNumber() === 18);
        },
        "determinant4x4": function() {
            var matr = new Matrix(4, 4);

            matr.setMatrix(
                [
                    [3, 7, -5, -2],
                    [4, 2, 0, -6],
                    [0, 2, 0, -1],
                    [-9, 2, 3, 6]
                ]
            );

            var det = matr.determinant();

            assert(det.toNumber() === 44);
        },
        "multiplication": function () {
            var first = new Matrix(2, 3);
            var second = new Matrix(3, 2);

            first.setMatrix(
                [
                    [1, 2, 3],
                    [4, 5, 6]
                ]
            );

            second.setMatrix(
                [
                    [7, 8],
                    [9, 10],
                    [11, 12]
                ]
            );

            var third = first.multiply(second);

            assert(third.getNumRows() === first.getNumRows());
            assert(third.getNumColumns() === second.getNumColumns());

            assert(third.getValue(0, 0).toNumber() === 58);
            assert(third.getValue(0, 1).toNumber() === 64);
            assert(third.getValue(1, 0).toNumber() === 139);
            assert(third.getValue(1, 1).toNumber() === 154);
        },
        "inversion": function () {
            var matrix = new Matrix(3, 3), inverse = new Matrix(3,3);
            matrix.setMatrix(
                [
                    [1, 3, 3],
                    [1, 4, 3],
                    [1, 3, 4]
                ]
            );

            inverse.setMatrix(
                [
                    [7, -3, -3],
                    [-1, 1, 0],
                    [-1, 0, 1]
                ]
            );

            var reduced = matrix.inverse();

            assert(reduced.equals(inverse));
        },
        "multiplication and inversion": function () {
            var a = new Matrix(3, 3),
                message = new Matrix(3, 6),
                decoded = new Matrix(3, 6);

            a.setMatrix(
                [
                    [1, 2, 3],
                    [0, 1, 4],
                    [5, 6, 0]
                ]
            );

            message.setMatrix(
                [
                    [108, 8, 26, 95, 69, 3],
                    [79, 0, 13, 95, 76, 1],
                    [238, 40, 79, 114, 60, 11]
                ]
            );

            decoded.setMatrix(
                [
                    [20, 8, 5, 0, 12, 1],
                    [23, 0, 9, 19, 0, 1],
                    [14, 0, 1, 19, 19, 0]
                ]
            );

            var inverse = a.inverse();
            var result = inverse.multiply(message);

            assert(result.equals(decoded));
        }
    });
});