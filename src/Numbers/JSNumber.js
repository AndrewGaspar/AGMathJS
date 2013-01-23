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

    var JSNumber = (function () {
        var JSNumber = function (value) {

            value = toNumber(value);

            this.toNumber = function () {
                return value;
            }
        };

        JSNumber.prototype = {
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
                return new JSNumber(-this.toNumber());
            },

            abs: function () {
                var out = this.toNumber();

                return new JSNumber((out < 0) ? -out : out);
            },

            inverse: function () {
                return new JSNumber(1 / this.toNumber());
            },

            add: function (val) {
                var number;

                if (val.toNumber) {
                    if (isJSNumber(val)) {
                        number = val.toNumber();
                    } else {
                        return val.add(this);
                    }
                } else {
                    number = toNumber(val);
                }

                return new JSNumber(this.toNumber() + number);
            },

            subtract: function (val) {
                var number;

                if (val.toNumber) {
                    if (isJSNumber(val)) {
                        number = val.toNumber();
                    } else {
                        return val.subtract(this).negative();
                    }
                } else {
                    number = toNumber(val);
                }

                return new JSNumber(this.toNumber() - number);
            },

            multiply: function (val) {
                var number;

                if (val.toNumber) {
                    if (isJSNumber(val)) {
                        number = val.toNumber();
                    } else {
                        return val.multiply(this);
                    }
                } else {
                    number = toNumber(val);
                }

                return new JSNumber(this.toNumber() * number);
            },

            divide: function (val) {
                var number;

                if (val.toNumber) {
                    if (isJSNumber(val)) {
                        number = val.toNumber();
                    } else {
                        return val.divide(this).inverse();
                    }
                } else {
                    number = toNumber(val);
                }

                return new JSNumber(this.toNumber() / number);
            },

            toString: function () {
                return this.toNumber().toString();
            }
        };

        return JSNumber;
    })();

    JSNumber.Zero = {
        toNumber: function () { return 0; },
        isZero: function() {
            return true;
        },
        equals: function (value, epsilon) {
            value = toNumber(value);

            return value.equals(JSNumber.Zero);
        },
        negative: function() {
            return JSNumber.Zero;
        },
        abs: function() {
            return 0;
        },
        inverse: function() {
            return new JSNumber(1 / 0);
        },
        add: function (val) {
            if (val.toNumber)
                return val;
            else
                return new JSNumber(val);
        },
        subtract: function (val) {
            if (val.toNumber)
                return val.negative();
            else
                return new JSNumber(val);
        },
        multiply: function () {
            return JSNumber.Zero;
        },
        divide: function () {
            return JSNumber.Zero;
        },
        toString: function () {
            return (0).toString();
        }
    };

    var methods = ["isZero", "equals", "negative", "abs", "inverse", "add", "subtract", "multiply", "divide"];

    for (var i in methods) {
        Number.prototype[methods[i]] = (function (method) {
            return function () {
                return JSNumber.prototype[method].apply(new JSNumber(this.valueOf()), arguments);
            }
        })(methods[i]);
    }

    //Number.prototype.toNumber = function () { return this; }
    //Number.prototype.isZero = function () { return (new JSNumber(this.valueOf())).isZero(); }

    //for (var method in JSNumber.prototype) {
    //    if (JSNumber.prototype[method] != JSNumber.prototype.toString) {
    //        Number.prototype[method] = function () {
    //            //return JSNumber.prototype[method].apply(new JSNumber(this), arguments);
    //            var jsn = new JSNumber(this.valueOf());
    //            return jsn[method](arguments);
    //        };
    //    }
    //}

    return JSNumber;
});