/// <reference path="lib/require.js" />
define(["Matrix/Matrix", "Matrix/Vector", "Numbers/JSNumber", "Numbers/ComplexNumber"], function (Matrix, Vector, JSNumber, ComplexNumber) {

    return {
        Matrix: {
            Matrix: Matrix,
            Vector: Vector
        },
        Numbers: {
            JSNumber: JSNumber,
            ComplexNumber: ComplexNumber
        }
    };

});