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
                return new JSNumber(1 / value);
            },

            add: function (val) {
                val = toNumber(val);
                return new JSNumber(this.toNumber() + val);
            },

            subtract: function (val) {
                val = toNumber(val);
                return new JSNumber(this.toNumber() - val);
            },

            multiply: function (val) {
                val = toNumber(val);
                return new JSNumber(this.toNumber() * val);
            },

            divide: function (val) {
                val = toNumber(val);
                return new JSNumber(this.toNumber() / val);
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
            val = toNumber(val);
            return val;
        },
        subtract: function (val) {
            val = toNumber(val);
            return val.negative();
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

    return JSNumber;
});