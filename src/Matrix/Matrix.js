define(["Numbers/JSNumber", "Matrix/Vector"], 
    function (JSNumber, Vector) {
        var Matrix = (function () {
            var Matrix = function (m, n) {
                var mat = new Array(m * n);

                this.getNumRows = function () {
                    return m;
                }

                this.getNumColumns = function () {
                    return n;
                }

                this.getValue = function (row, column) {
                    return mat[n * row + column];
                }

                this.setValue = function (row, column, value) {
                    if (!value.toNumber) {
                        if (typeof (value) === "number") {
                            value = new JSNumber(value);
                        } else {
                            throw "not a number type!";
                        }
                    }

                    mat[n * row + column] = value;
                }

                for (var i = 0; i < m; i++) {
                    for (var j = 0; j < n; j++) {
                        this.setValue(i, j, JSNumber.Zero);
                    }
                }
            }

            Matrix.prototype = {
                setRow: function (row, value) {
                    if (!(value instanceof Array)) {
                        if (value instanceof Vector) {
                            value = value.toArray();
                        } else {
                            throw "value must be an Array or Vector";
                        }
                    }

                    var rowLength = Math.min(value.length, this.getNumColumns());

                    for (var i = 0; i < rowLength; i++) {
                        this.setValue(row, i, value[i]);
                    }
                },

                setColumn: function (column, value) {
                    if (!(value instanceof Array)) {
                        if (value instanceof Vector) {
                            value = value.toArray();
                        } else {
                            throw "value must be an Array or Vector";
                        }
                    }

                    var columnLength = Math.min(value.length, this.getNumRows());

                    for (var i = 0; i < columnLength; i++) {
                        this.setValue(i, column, value[i]);
                    }
                },

                setMatrix: function (value) {
                    if (!(value instanceof Array)) {
                        throw "value must be an array!";
                    }

                    var rows = Math.min(value.length, this.getNumRows());

                    for (var i = 0; i < rows; i++) {
                        this.setRow(i, value[i]);
                    }
                },

                getRow: function (row) {
                    var rowOut = new Array(this.getNumColumns());
                    for (var i = 0; i < rowOut.length; i++) {
                        rowOut[i] = this.getValue(row, i);
                    }
                    return new Vector(rowOut);
                },

                getColumn: function (column) {
                    var columnOut = new Array(this.getNumRows());
                    for (var i = 0; i < columnOut.length; i++) {
                        columnOut[i] = this.getValue(i, column);
                    }

                    return new Vector(columnOut);
                },

                copy: function() {
                    var out = new Matrix(this.getNumRows(), this.getNumColumns());

                    for (var i = 0; i < out.getNumRows() ; i++) {
                        for (var j = 0; j < out.getNumColumns() ; j++) {
                            out.setValue(i, j, this.getValue(i, j));
                        }
                    }

                    return out;
                },

                swapRows: function (i, j) {
                    if (i !== j) {
                        var temp = this.getRow(i);
                        this.setRow(i, this.getRow(j));
                        this.setRow(j, temp);
                    }
                },

                equals: function(matrix) {
                    if(!(matrix instanceof Matrix)) {
                        throw "Must be of type Matrix.";
                    }

                    if (matrix.getNumRows() !== this.getNumRows() && matrix.getNumColumns() !== this.getNumColumns()) {
                        throw "Matrices must be same size.";
                    }

                    for (var i = 0; i < this.getNumRows() ; i++) {
                        for (var j = 0; j < this.getNumColumns() ; j++) {
                            if (!this.getValue(i, j).equals(matrix.getValue(i, j))) {
                                return false;
                            }
                        }
                    }

                    return true;
                },

                determinant: function () {
                    if (this.getNumRows() !== this.getNumColumns()) {
                        throw "n x n Matrix required to determine determinant.";
                    }

                    var n = this.getNumColumns();

                    if (n === 2) {
                        var first = this.getValue(0, 0).multiply(this.getValue(1, 1));
                        var second = this.getValue(0, 1).multiply(this.getValue(1, 0));
                        return first.subtract(second);
                    }

                    var total = null;
                    for (var i = 0; i < n; i++) {

                        var sub = new Matrix(n - 1, n - 1);
                        var colNum = 0;

                        for (var j = 0; j < n; j++) {
                            if (j != i) {
                                var col = this.getColumn(j).toArray().slice(1, n);
                                sub.setColumn(colNum++, col);
                            }
                        }

                        var sum = this.getValue(0, i).multiply(sub.determinant());

                        total = (total) ? (i%2) ? total.subtract(sum) : total.add(sum) : sum;
                    }

                    return total;
                },

                transpose: function() {
                    var self = this;
                    
                    var t = new Matrix(self.getNumColumns(), self.getNumRows());
                    
                    for(var i = 0; i < self.getNumRows(); i++) {
                        for(var j = 0; j < self.getNumColumns(); j++) {
                            t.setValue(j,i, self.getValue(i,j));
                        }
                    }
                    
                    return t;
                },

                add: function(matrix2) {
                    if (!(matrix2 instanceof Matrix)) {
                        throw "input must be Matrix";
                    } else if (this.getNumColumns() != matrix2.getNumColumns() && this.getNumRows() != matrix2.getNumRows()) {
                        throw "Both matrices must be m x n.";
                    }

                    var out = new Matrix(this.getNumRows(), this.getNumColumns());

                    for (var i = 0; i < out.getNumRows() ; i++) {
                        for (var j = 0; j < out.getNumColumns() ; j++) {
                            out.setValue(i, j, this.getValue(i, j).add(matrix2.getValue(i, j)));
                        }
                    }
                },

                subtract: function(matrix2) {
                    if (!(matrix2 instanceof Matrix)) {
                        throw "input must be Matrix";
                    } else if (this.getNumColumns() != matrix2.getNumColumns() && this.getNumRows() != matrix2.getNumRows()) {
                        throw "Both matrices must be m x n.";
                    }

                    var out = new Matrix(this.getNumRows(), this.getNumColumns());

                    for (var i = 0; i < out.getNumRows() ; i++) {
                        for (var j = 0; j < out.getNumColumns() ; j++) {
                            out.setValue(i, j, this.getValue(i, j).subtract(matrix2.getValue(i, j)));
                        }
                    }
                },

                multiply: function () {
                    if (arguments[0] instanceof Matrix) {
                        var matrix2 = arguments[0];

                        if (this.getNumColumns() != matrix2.getNumRows()) {
                            throw "This matrices number of columns must equal input's number of rows.";
                        }

                        var out = new Matrix(this.getNumRows(), matrix2.getNumColumns());

                        for (var j = 0; j < out.getNumColumns() ; j++) {
                            for (var i = 0; i < out.getNumRows() ; i++) {
                                var row = this.getRow(i);
                                var column = matrix2.getColumn(j);
                                var dot = row.dot(column);

                                out.setValue(i, j, dot);
                            }
                        }

                        return out;
                    } else if(arguments[0] instanceof Vector) {
                        var vector = arguments[0];

                        if (this.getNumColumns() != vector.getLength()) {
                            throw "The vector must be in R^n";
                        }

                        var out = new Vector(vector.getLength());

                        for (var i = 0; i < out.getNumRows() ; i++) {
                            var row = this.getRow(i);
                            var dot = row.dot(vector);

                            out.setValue(i, dot);
                        }

                        return out;
                    } else {
                        var scale = arguments[0];

                        if (!scale.toNumber && typeof scale !== 'number') {
                            throw "input must be Matrix, Vector, or Number";
                        }

                        var out = new Matrix(this.getNumRows(), this.getNumColumns());

                        for (var i = 0; i < out.getNumRows() ; i++) {
                            for (var j = 0; j < out.getNumColumns() ; j++) {
                                out.setValue(i, j, this.getValue(i, j).multiply(scale));
                            }
                        }

                        return out;
                    }
                },

                rowReduce: function () {
                    var self = this;

                    if (this.getNumRows() > this.getNumColumns()) {
                        throw "m must be <= n";
                    }

                    var currentColumn = 0, currentRow = 0, out = this.copy();

                    for (var i = 0; i < out.getNumRows(); i++) {
                        var selected = (function () {
                            while (currentColumn < out.getNumColumns()) {
                                for (var j = currentRow; j < out.getNumRows(); j++) {
                                    if (!out.getValue(j, currentColumn).isZero()) {
                                        return j;
                                    }
                                }

                                currentColumn++;
                            }

                            throw "Not reducible.";
                        })();

                        out.swapRows(selected, currentRow);

                        var value = out.getValue(currentRow, currentColumn),
                            row = out.getRow(currentRow).divide(value);

                        out.setRow(currentRow, row);

                        for (var j = 0; j < out.getNumRows(); j++) {
                            if (j !== i) {
                                var scale = out.getValue(j, currentColumn).negative(),
                                    outRow = out.getRow(j).add(row.multiply(scale));

                                out.setRow(j, outRow);
                            }
                        }

                        currentRow++;
                        currentColumn++;
                    }

                    return out;
                },

                inverse: function () {
                    if (this.getNumRows() !== this.getNumColumns()) {
                        throw "n x n Matrix required to determine inverse.";
                    }

                    var inv = Matrix.Identity(this.getNumRows()),
                        toBeReduced = new Matrix(this.getNumRows(), this.getNumColumns() * 2);

                    for (var i = 0; i < this.getNumColumns() ; i++) {
                        toBeReduced.setColumn(i, this.getColumn(i));
                    }

                    for (var i = this.getNumColumns() ; i < this.getNumColumns() * 2; i++) {
                        toBeReduced.setColumn(i, inv.getColumn(i - this.getNumColumns()));
                    }

                    var reduced = toBeReduced.rowReduce();

                    for (var i = 0; i < this.getNumColumns() ; i++) {
                        for (var j = 0; j < this.getNumRows() ; j++) {
                            var verify;

                            if (i === j) {
                                verify = reduced.getValue(j, i).equals(1);
                            } else {
                                verify = reduced.getValue(j, i).isZero();
                            }

                            if (!verify) throw "could not be inverted!";
                        }
                    }

                    var inv = new Matrix(this.getNumRows(), this.getNumColumns());

                    for (var i = 0; i < this.getNumColumns() ; i++) {
                        inv.setColumn(i, reduced.getColumn(i + this.getNumColumns()));
                    }

                    return inv;
                },

                toString: function () {
                    var myString = "[";
                    for (var i = 0; i < this.getNumRows() ; i++) {
                        myString += this.getRow(i);

                        if (i != this.getNumRows() - 1) {
                            myString += ",";
                        }
                    }

                    myString += "]";

                    return myString;
                }
            }

            Matrix.Identity = function (n) {
                var idnt = new Matrix(n, n);

                for (var i = 0 ; i < n; i++) {
                    idnt.setValue(i, i, 1);
                }

                return idnt;
            }

            return Matrix;
        })();

        return Matrix;
    }
);