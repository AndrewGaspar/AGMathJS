define(function () {

    function toNumber(val) {
        if (val.toNumber) {
            return val.toNumber();
        } else if (val instanceof Number) {
            return val;
        } else {
            return new Number(val);
        }
    }

    function isInt(n) {
        return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
    }

    

    var FractionalNumber = (function () {
        function Fraction(numerator, denominator) {
            if (denominator === undefined) { denominator = 1; }

            numerator = Math.round(toNumber(numerator));
            denominator = Math.round(toNumber(denominator));

            if (!isInt(numerator) || !isInt(denominator)) {
                return new JSNumber(numerator / denominator);
            }

            this.isNegative = ((numerator < 0) ^ (denominator < 0));

            numerator = (numerator < 0) ? -numerator : numerator;
            denominator = (denominator < 0) ? -denominator : denominator;

            this.getNumerator = function () {
                return numerator;
            }

            this.getDenominator = function () {
                return denominator;
            }

            this.toNumber = function () {
                return numerator / denominator * (-1 * this.isNegative);
            }
        }

        Fraction.prototype = {
            negative: function () {
                return new FractionalNumber(-this.getNumerator(), this.getDenominator());
            },

            add: function (val) {
                if (val instanceof FractionalNumber) {
                    return new FractionalNumber(this.getNumerator() * val.getDenominator() + val.getNumerator() * this.getDenominator(), this.getDenominator() * val.getDenominator());
                } else {
                    return new JSNumber(toNumber(this) + toNumber(val));
                }
            },

            subtract: function (val) {
                if (val instanceof FractionalNumber) {
                    return new FractionalNumber(this.getNumerator() * val.getDenominator() - val.getNumerator() * this.getDenominator(), this.getDenominator() * val.getDenominator());
                } else {
                    return new JSNumber(toNumber(this) - toNumber(val));
                }
            },

            multiply: function (val) {

            }
        };
    })();

    var NumberFactory = function () {
        this.getJSNumber = function (val) {
            return new JSNumber(val);
        }
    }

    return new NumberFactory();
});