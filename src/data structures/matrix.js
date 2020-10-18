"use strict";

//A class for matrices. 
function Matrix(els) {
	this.els = els;
}

Matrix.prototype.toString = function() {
	return JSON.stringify(this.els);
};

Matrix.prototype.width = function() {
	return this.els[0].length;
};

Matrix.prototype.height = function() {
	return this.els.length;
};

Matrix.identity = function(size) {
	var entries = [];
	for(var i = 0; i < size; i++) {
		var row = [];
		for(var j = 0; j < size; j++)
			row.push(i == j ? 1 : 0);
		entries.push(row);
	}
	return new Matrix(entries);
};

//This uses column vectors and IDK if that's consistent with three.js
Matrix.prototype.movePoint = function(point) {
	var newCoordinates = [];
	if(this.width() != point.dimensions())
		throw new Error("Invalid dimensions for matrix-vector multiplication!");
	for(var i = 0; i < this.height(); i++) {
		var currentCoordinate = 0;
		for(var j = 0; j < this.width(); j++)
			currentCoordinate += this.els[i][j] * point.coordinates[j];
		newCoordinates.push(currentCoordinate);
	}
	return new Point(newCoordinates);
};

Matrix.prototype.inverse = function() {
	throw new Error("Matrix.inverse is not yet implemented");
};

Matrix.prototype.multiply = function(matrix) {
	var newEntries = [];
	if(this.width() != matrix.height())
		throw new Error("Invalid dimensions for matrix multiplication!")
	for(var i = 0; i < this.height(); i++) {
		var newRow = [];
		for(var j = 0; j < matrix.width(); j++) {
			var newEntry = 0;
			for(var k = 0; k < this.width(); k++) {
				newEntry += this.els[i][k] * matrix.els[k][j];
			}
			newRow.push(newEntry);
		}
		newEntries.push(newRow);
	}
	return new Matrix(newEntries);
};

//-1 is this<matrix, 0 is this==matrix, 1 is this>matrix
Matrix.prototype.compare = function(matrix) {
	if(this.width() != matrix.width() || this.height() != matrix.height())
		throw new Error("Invalid dimensions for matrix comparison!");
	for(var i = 0; i < this.height(); i++) {
		for(var j = 0; j < this.width(); j++) {
			if(this.els[i][j] > matrix.els[i][j])
				return 1;
			if(this.els[i][j] < matrix.els[i][j])
				return -1;
		}
	}
	return 0;
};
