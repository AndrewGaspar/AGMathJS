/// <reference path="lib/require.js" />
define(["Matrix/Matrix", "Matrix/Vector", "Numbers/JSNumber", "Numbers/ComplexNumber", "Numbers/FractionalNumber"], function (Matrix, Vector, JSNumber, ComplexNumber, FractionalNumber) {

    return {
        Matrix: {
            Matrix: Matrix,
            Vector: Vector
        },
        Numbers: {
            JSNumber: JSNumber,
            ComplexNumber: ComplexNumber,
            FractionalNumber: FractionalNumber
        }
    };

});