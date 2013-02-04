define(function () {
    function toNumber(val) {
        if (val.toNumber) {
            return val.toNumber();
        } else if (typeof val === "number") {
            return val;
        } else {
            throw "NaN";
        }
    }

    function isJSNumber(val) {
        return val instanceof JSNumber || typeof val === "number" || val === JSNumber.Zero;
    }

    function gcd(a, b) {
        if (b === 0) return a;
        else return gcd(b, a % b);
    }

    var MAXVALUE = Math.pow(2, 53);

    function willLosePrecision(val) {
        return Math.abs(val) > MAXVALUE;
    }

    var FractionalNumber = (function () {

        /**
            A number that has a numerator and denominator.
            
            Any non-integer values provided will be rounded to nearest integer.

            @class FractionalNumber
            @constructor

            @param {Number} n The numerator of the Fraction
            @param {Number} d The denominator of the Fraction
        */
        function FractionalNumber(n, d) {
            var numerator, denominator, negative;

            if (arguments.length >= 1) {
                numerator = Number(arguments[0]);
                if (arguments.length >= 2) {
                    if (arguments[0].isAGNumber || arguments[1].isAGNumber) return arguments[0].divide(arguments[1]);
                    denominator = Number(arguments[1]);
                } else {
                    if (arguments[0].isAGNumber) return arguments[0];
                    denominator = 1;
                }
            } else {
                numerator = 1;
                denominator = 1;
            }

            //numerator = (arguments.length >= 1) ? Number(arguments[0]) : 1;
            //denominator = (arguments.length >= 2) ? Number(arguments[1]) : 1;
            
            negative = !!(numerator < 0 ^ denominator < 0);

            numerator = Math.abs((numerator % 1 === 0) ? numerator : Math.round(numerator));
            denominator = Math.abs((denominator % 1 === 0) ? denominator : Math.round(denominator));

            var isReduced = false;

            this.reduce = function () {
                var factor;
                if (!isReduced) {
                    while ((factor = gcd(numerator, denominator)) !== 1) {
                        numerator /= factor;
                        denominator /= factor;
                    }
                    isReduced = true;
                }
            }

            this.isNegative = function () {
                return negative;
            }

            this.negativeFactor = function () {
                return (negative) ? -1 : 1;
            }

            this.getNumerator = function () {
                return numerator;
            }

            this.getDenominator = function () {
                return denominator;
            }

            this.toNumber = function () {
                return numerator / denominator * ((negative) ? -1 : 1);
            }
        };

        FractionalNumber.prototype = {
            isAGNumber: true,
            isZero: function (epsilon) {
                if (!epsilon) {
                    epsilon = 0.000001;
                }

                return this.abs().toNumber() < epsilon;
            },

            equals: function (value, epsilon) {
                value = toNumber(value);

                if (!epsilon) {
                    epsilon = 0.000001;
                }

                return this.subtract(value).abs().toNumber() < epsilon;
            },

            negative: function () {
                return new FractionalNumber(-this.getNegative() * this.getNumerator(), this.getDenominator());
            },

            abs: function () {
                var out = this.toNumber();

                return new FractionalNumber(this.getNumerator(), this.getDenominator());
            },

            inverse: function () {
                if(this.isNegative())
                    return new FractionalNumber(-this.getDenominator(), this.getNumerator());
                else
                    return new FractionalNumber(this.getDenominator(), this.getNumerator());
            },

            add: function (val) {
                var number;
                if (val instanceof FractionalNumber) {
                    var numerator, denominator;

                    numerator = this.negativeFactor() * this.getNumerator() * val.getDenominator() + val.negativeFactor() * val.getNumerator() * this.getDenominator();
                    denominator = this.getDenominator() * val.getDenominator();

                    if (willLosePrecision(numerator) || willLosePrecision(denominator)) {
                        this.reduce();
                        val.reduce();

                        numerator = this.negativeFactor() * this.getNumerator() * val.getDenominator() + val.negativeFactor() * val.getNumerator() * this.getDenominator();
                        denominator = this.getDenominator() * val.getDenominator();
                    }

                    return new FractionalNumber(numerator, denominator);
                }
                else {
                    if (val.isAGNumber) {
                        if (isJSNumber(val)) {
                            number = val.toNumber();
                        } else {
                            return val.add(this);
                        }
                    } else {
                        number = toNumber(val);
                    }

                    var numerator = this.negativeFactor() * this.getNumerator() + number * this.getDenominator();
                    if (willLosePrecision(numerator)) {
                        this.reduce();
                        numerator = this.negativeFactor() * this.getNumerator() + number * this.getDenominator();
                    }

                    return new FractionalNumber(numerator, this.getDenominator());
                }
            },

            subtract: function (val) {
                var number;

                if (val instanceof FractionalNumber) {
                    var numerator, denominator;

                    numerator = this.negativeFactor() * this.getNumerator() * val.getDenominator() - val.negativeFactor() * val.getNumerator() * this.getDenominator();
                    denominator = this.getDenominator() * val.getDenominator();

                    if (willLosePrecision(numerator) || willLosePrecision(denominator)) {
                        this.reduce();
                        val.reduce();

                        numerator = this.negativeFactor() * this.getNumerator() * val.getDenominator() - val.negativeFactor() * val.getNumerator() * this.getDenominator();
                        denominator = this.getDenominator() * val.getDenominator();
                    }

                    return new FractionalNumber(numerator, denominator);
                }
                else {
                    if (val.isAGNumber) {
                        if (isJSNumber(val)) {
                            number = val.toNumber();
                        } else {
                            return val.subtract(this).negative();
                        }
                    } else {
                        number = toNumber(val);
                    }

                    var numerator = this.negativeFactor() * this.getNumerator() - number * this.getDenominator();
                    if (willLosePrecision(numerator)) {
                        this.reduce();
                        numerator = this.negativeFactor() * this.getNumerator() - number * this.getDenominator();
                    }

                    return new FractionalNumber(numerator, this.getDenominator());
                }
            },

            multiply: function (val) {
                var number;
                if (val instanceof FractionalNumber) {
                    var numerator, denominator;

                    numerator = this.negativeFactor() * this.getNumerator() * val.negativeFactor() * val.getNumerator();
                    denominator = this.getDenominator() * val.getDenominator();

                    if (willLosePrecision(numerator) || willLosePrecision(denominator)) {
                        this.reduce();
                        val.reduce();

                        numerator = this.negativeFactor() * this.getNumerator() * val.negativeFactor() * val.getNumerator();
                        denominator = this.getDenominator() * val.getDenominator();
                    }

                    return new FractionalNumber(numerator, denominator);
                } else {
                    if (val.isAGNumber) {
                        if (isJSNumber(val)) {
                            number = val.toNumber();
                        } else {
                            return val.multiply(this);
                        }
                    } else {
                        number = toNumber(val);
                    }

                    if (Math.abs(number) < 1) number = 1 / number;

                    var numerator = this.negativeFactor() * this.getNumerator() * number;
                    if (willLosePrecision(numerator)) {
                        this.reduce();
                        numerator = this.negativeFactor() * this.getNumerator() * number;
                    }

                    return new FractionalNumber(numerator, this.getDenominator());
                }
            },

            divide: function (val) {
                var number;

                if (val instanceof FractionalNumber) {
                    var numerator, denominator;

                    numerator = this.negativeFactor() * this.getNumerator() * val.negativeFactor() * val.getDenominator();
                    denominator = this.getDenominator() * val.getNumerator();

                    if (willLosePrecision(numerator) || willLosePrecision(denominator)) {
                        this.reduce();
                        val.reduce();

                        numerator = this.negativeFactor() * this.getNumerator() * val.negativeFactor() * val.getDenominator();
                        denominator = this.getDenominator() * val.getNumerator();
                    }

                    return new FractionalNumber(numerator, denominator);
                } else {
                    if (val.isAGNumber) {
                        if (isJSNumber(val)) {
                            number = val.toNumber();
                        } else {
                            return val.divide(this).inverse();
                        }
                    } else {
                        number = toNumber(val);
                    }

                    if (Math.abs(number) < 1) number = 1 / number;

                    var denominator = this.getDenominator() * number;
                    if (willLosePrecision(denominator)) {
                        this.reduce();
                        denominator = this.getDenominator() * number;
                    }

                    return new FractionalNumber(this.negativeFactor() * this.getNumerator(), denominator);
                }
            },

            toString: function () {
                this.reduce();
                return this.negativeFactor() * this.getNumerator() + "/" + this.getDenominator();
            }
        };

        return FractionalNumber;
    })();

    return FractionalNumber;
});