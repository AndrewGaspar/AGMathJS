/// <reference path="lib/require.js" />
define(["Matrix/Matrix", "Matrix/Vector", "Numbers/JSNumber"], function (Matrix, Vector, JSNumber) {

    return {
        Matrix: {
            Matrix: Matrix,
            Vector: Vector
        },
        Numbers: {
            JSNumber: JSNumber
        }
    };

});