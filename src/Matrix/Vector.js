define(["Numbers/JSNumber"],
    function (JSNumber) {
        var Vector = (function () {
            var Vector = function () {

                var length, vec;

                if (arguments[0] instanceof Array) {
                    length = arguments[0].length;
                    vec = new Array(length);
                    for (var i = 0; i < length; i++) {
                        vec[i] = (arguments[0][i].toNumber) ? arguments[0][i] : new JSNumber(arguments[0][i]);
                    }
                } else if (typeof (arguments[0]) === 'number') {
                    length = arguments[0];
                    vec = new Array(length);
                }

                this.getLength = function () {
                    return length;
                }

                this.getValue = function (index) {
                    return vec[index];
                }

                this.setValue = function (index, value) {
                    if (!value.toNumber) {
                        if (typeof (value) === "number") {
                            value = new JSNumber(value);
                        } else {
                            throw "not a number type!";
                        }
                    }

                    vec[index] = value;
                }

                this.toArray = function () {
                    var out = new Array(this.getLength());

                    for (var i = 0; i < out.length; i++) {
                        out[i] = this.getValue(i);
                    }

                    return out;
                }
            }

            Vector.prototype = {
                negative: function() {
                    var out = new Vector(this.getLength());

                    for (var i = 0; i < out.getLength() ; i++) {
                        out.setValue(i, this.getValue(i).negative());
                    }

                    return out;
                },
                add: function(vec) {
                    if (this.getLength() !== vec.getLength()) {
                        throw "The vectors must have the same length!";
                    }

                    var out = new Vector(this.getLength());

                    for (var i = 0; i < out.getLength() ; i++) {
                        out.setValue(i, this.getValue(i).add(vec.getValue(i)));
                    }

                    return out;
                },
                subtract: function (vec) {
                    if (this.getLength() !== vec.getLength()) {
                        throw "The vectors must have the same length!";
                    }

                    var out = new Vector(this.getLength());

                    for (var i = 0; i < out.getLength() ; i++) {
                        out.setValue(i, this.getValue(i).subtract(vec.getValue(i)));
                    }

                    return out;
                },
                multiply: function(value) {
                    if (!value.toNumber) {
                        if (typeof value === 'number') {
                            value = new JSNumber(value);
                        } else {
                            throw "value must be number!";
                        }
                    }

                    var out = new Vector(this.getLength());

                    for (var i = 0; i < out.getLength() ; i++) {
                        out.setValue(i, this.getValue(i).multiply(value));
                    }

                    return out;
                },
                divide: function(value) {
                    if (!value.toNumber && typeof value !== 'number') {
                        throw "value must be number!";
                    }

                    var out = new Vector(this.getLength());

                    for (var i = 0; i < out.getLength() ; i++) {
                        out.setValue(i, this.getValue(i).divide(value));
                    }

                    return out;
                },
                dot: function (vec) {
                    if (this.getLength() !== vec.getLength()) {
                        throw "The vectors must have the same length!";
                    }

                    var total = null;

                    for (var i = 0; i < this.getLength() ; i++) {
                        var next = this.getValue(i).multiply(vec.getValue(i));

                        total = (total) ? total.add(next) : next;
                    }

                    return total;
                },
                equals: function(vec, epsilons) {
                    if (this.getLength() !== vec.getLength()) return false;

                    for (var i = 0; i < this.getLength(); i++) {
                        var eps = (epsilons instanceof Array) ? epsilons[i] : epsilons;
                        if (!this.getValue(i).equals(vec.getValue(i), eps)) return false;
                    }

                    return true;
                },
                toString: function () {
                    var myString = "[";
                    for (var i = 0; i < this.getLength() ; i++) {
                        myString += this.getValue(i);

                        if (i != this.getLength() - 1) {
                            myString += ",";
                        }
                    }
                    myString += "]";

                    return myString;
                }
            }

            return Vector;
        })();

        return Vector;
    }
);