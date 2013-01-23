﻿/// <reference path="node_modules/requirejs/require.js" />

var buster = require("buster");

var requirejs = require("requirejs");
requirejs.config({
    baseUrl: "./src",
    nodeRequire: require
});

requirejs(["Numbers/JSNumber", "Numbers/ComplexNumber", "Matrix/Matrix", "Matrix/Vector"], function (JSNumber, ComplexNumber, Matrix, Vector) {
    buster.testCase("JSNumber Tests", {
        "simple addition": function () {
            var seven = new JSNumber(7);
            assert(seven.add(8).toNumber() === 15);
        },
        "number test": function () {
            console.log((8).divide(2));
            assert((8).divide(2).equals(new JSNumber(8).divide(new JSNumber(2))));
        }
    });

    buster.testCase("ComplexNumber Tests", {
        "addition to regular number": function () {
            var first = new ComplexNumber(2, 5);
            var second = 8;

            var third = first.add(second);

            assert(third.getReal().equals(10) && third.getImaginary().equals(5));
        },
        "complex addition": function () {
            var first = new ComplexNumber(-8, 13);
            var second = new ComplexNumber(5, -21);

            var third = first.add(second);
            
            assert(third.getReal().equals(-3) && third.getImaginary().equals(-8));
        },
        "subtraction": function () {
            var first = new ComplexNumber(7, 2);
            var second = new ComplexNumber(5, 3);

            var third = first.subtract(second);

            assert(third.getReal().equals(2) && third.getImaginary().equals(-1));
        },
        "constant multiplication": function() {
            var first = new ComplexNumber(2.4, -8);
            var second = 5;

            var third = first.multiply(second);

            assert(third.getReal().equals(12) && third.getImaginary().equals(-40));
        },
        "complex multiplication": function () {
            var first = new ComplexNumber(7, 3);
            var second = new ComplexNumber(-6, 2);

            var third = first.multiply(second);

            assert(third.getReal().equals(-48) && third.getImaginary().equals(-4));
        },
        "constant division": function () {
            var first = new ComplexNumber(10, 2);
            var second = 4;

            var third = first.divide(second);

            assert(third.getReal().equals(5/2) && third.getImaginary().equals(1/2));
        },
        "complex division": function () {
            var first = new ComplexNumber(12, 7);
            var second = new ComplexNumber(6, 3.6);

            var third = first.divide(second);

            assert(third.getReal().equals(97.2/48.96) && third.getImaginary().equals(-1.2/48.96));
        },
        "abs": function () {
            var number = new ComplexNumber(6, 8);

            assert(number.abs().equals(10));
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
        },
        "complex row reduction": function () {
            var a = new Matrix(3, 4);

            a.setMatrix(
                [
                    [1, 2, 2, -3],
                    [2, 1, 1, 0],
                    [1, -1, new ComplexNumber(0, -1), new ComplexNumber(0, 1)]
                ]
            );

            var answer = new Vector(
                [
                    1,
                    new ComplexNumber(0, 1),
                    new ComplexNumber(-2, -1)
                ]
            );

            var b = a.rowReduce();

            var result = b.getColumn(3);

            assert(result.equals(answer));
        }
    });
});