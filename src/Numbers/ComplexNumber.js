/// <reference path="../lib/require.js" />

define(["Numbers/JSNumber"], function (JSNumber) {
    var ComplexNumber = (function () {
        var ComplexNumber = function (r, i) {

            var real = (r.isAGNumber) ? r : new JSNumber(r),
                imaginary = (i.isAGNumber) ? i : new JSNumber(i);

            this.getReal = function () {
                return real;
            }

            this.getImaginary = function () {
                return imaginary;
            }

            this.toNumber = function () {
                var squared = this.getReal().multiply(this.getReal()).add(this.getImaginary().multiply(this.getImaginary())).toNumber();

                return Math.sqrt(squared);
            }
        };

        ComplexNumber.prototype = {
            isAGNumber: true,

            isZero: function (epsilon) {
                if (!epsilon) {
                    epsilon = 0.000001;
                }

                return this.getReal().isZero() && this.getImaginary().isZero();
            },

            equals: function (value, epsilon) {
                if (!epsilon) {
                    epsilon = 0.000001;
                }

                if (value instanceof ComplexNumber) {
                    return this.subtract(value).isZero();
                } else {
                    if (this.getImaginary().isZero()) {
                        return this.getReal().subtract(value).abs().toNumber() < epsilon;
                    } else return false;
                }
            },

            negative: function () {
                return new ComplexNumber(this.getReal().negative(), this.getImaginary().negative());
            },

            abs: function () {

                var squared = this.getReal().multiply(this.getReal()).add(this.getImaginary().multiply(this.getImaginary())).toNumber();

                return new JSNumber(Math.sqrt(squared));
            },

            inverse: function () {
                return (new ComplexNumber(1, 0)).divide(this);
            },

            add: function (val) {
                if(val instanceof ComplexNumber) {
                    return new ComplexNumber(this.getReal().add(val.getReal()), this.getImaginary().add(val.getImaginary()));
                } else {
                    return new ComplexNumber(this.getReal().add(val), this.getImaginary());
                }
            },

            subtract: function (val) {
                if (val instanceof ComplexNumber) {
                    return new ComplexNumber(this.getReal().subtract(val.getReal()), this.getImaginary().subtract(val.getImaginary()));
                } else {
                    return new ComplexNumber(this.getReal().subtract(val), this.getImaginary());
                }
            },

            multiply: function (val) {
                if(val instanceof ComplexNumber) {
                    var r = this.getReal().multiply(val.getReal()).subtract(this.getImaginary().multiply(val.getImaginary()));
                    var i = this.getReal().multiply(val.getImaginary()).add(this.getImaginary().multiply(val.getReal()));

                    return new ComplexNumber(r, i);
                } else {
                    return new ComplexNumber(this.getReal().multiply(val), this.getImaginary().multiply(val));
                }
            },

            divide: function (val) {
                if (val instanceof ComplexNumber) {
                    var denominator = val.getReal().multiply(val.getReal()).add(val.getImaginary().multiply(val.getImaginary()));

                    var r = this.getReal().multiply(val.getReal()).add(this.getImaginary().multiply(val.getImaginary()));
                    var i = this.getImaginary().multiply(val.getReal()).subtract(this.getReal().multiply(val.getImaginary()));

                    r = r.divide(denominator);
                    i = i.divide(denominator);

                    return new ComplexNumber(r, i);
                } else {
                    return new ComplexNumber(this.getReal().divide(val), this.getImaginary().divide(val));
                }
            },

            angle: function(val) {
                var self = this;
                var angle = new JSNumber(Math.atan(self.getImaginary().divide(self.getReal()).toNumber()));
                if (self.getReal().toNumber() < 0) {
                    if (self.getImaginary().toNumber() < 0) {
                        return new JSNumber(Math.PI).subtract(angle);
                    } else {
                        return new JSNumber(Math.PI).add(angle);
                    }
                    return 
                } else return angle;
            },

            complexConjugate: function() {
                return new ComplexNumber(this.getReal(), this.getImaginary().negative());
            },

            toString: function () {
                var string = "";
                
                if (this.isZero()) return "0";
                
                if (!this.getReal().isZero()) {
                    string += this.getReal().toString();
                }

                if (!this.getImaginary().isZero()) {
                    if (!this.getReal().isZero()) {
                        string += (this.getImaginary().toNumber() < 0) ? " - " : " + ";
                    } else {
                        string += (this.getImaginary().toNumber() < 0) ? " - " : "";
                    }

                    string += "i";
                    if (!this.getImaginary().abs().equals(1)) {
                        string += this.getImaginary().abs().toNumber().toString();
                    }
                }
                return string;
            }
        };

        return ComplexNumber;
    })();

    return ComplexNumber;
});