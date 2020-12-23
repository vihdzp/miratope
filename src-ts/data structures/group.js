"use strict";

//A class for abstract groups.



function Group() {
};

//Probably not a good idea for anything with more than a few hundred elements.
//AFAIK nothing better exists for MatrixGroup or many other representations,
//but RewriteGroup has a much faster algorithm that I'll implement later.
Group.prototype.enumerateElements = function(max) {
	var elems = [];
	var elemsToCheck = [this.identity()];
	whileLoop:
	while(elemsToCheck.length && elems.length < max) {
		var elem = elemsToCheck.pop();
		var duplicate = false;
		for(var j = 0; j < elems.length; j++) {
			if(this.equal(elems[j], elem))
				continue whileLoop;
		}
		elems.push(elem);
		for(var i = 0; i < this.generators.length; i++) {
			var newElem = this.multiply(elem, this.generators[i]);
			elemsToCheck.push(newElem);
		}
	}
	return elems;
};

//A class for groups defined using matrices.
function MatrixGroup(generators) {
	Group.call(this);
	this.generators = generators;
	this.dimension = generators[0].width();
}

MatrixGroup.prototype = new Group();

MatrixGroup.prototype.identity = function() {
	return Matrix.identity(this.dimension);
};

MatrixGroup.prototype.multiply = function(elem1, elem2) {
	return elem1.multiply(elem2);
};

MatrixGroup.prototype.invert = function(elem) {
	return elem1.inverse();
};

MatrixGroup.prototype.equal = function(elem1, elem2) {
	return (elem1.compare(elem2) === 0);
};

MatrixGroup.prototype.compare = function(elem1, elem2) {
	return elem1.compare(elem2);
};

RewriteGroup.prototype = new Group();

//A class for groups defined using normalizing rewriting systems.
function RewriteGroup(generators, system) {
	Group.call(this);
	this.generators = generators;
	this.system = system;
};

RewriteGroup.prototype.simplifyElement = function(elem) {
	var oldElem = "";
	while(elem !== oldElem){
		oldElem = elem;
		for(var i = 0; i < this.system.length; i++){
			elem = elem.replace(this.system[i][0], this.system[i][1]);
		}
	}
	return elem;
};

RewriteGroup.prototype.identity = function() {
	return "";
};

RewriteGroup.prototype.multiply = function(elem1, elem2) {
	return this.simplifyElement(elem1 + elem2);
};

RewriteGroup.prototype.invert = function(elem) {
	var inverse = "";
	for(var i = 0; i < elem.length; i++) {
		inverse = elem[i] + inverse;
	}
	return inverse;
};

RewriteGroup.prototype.equal = function(elem1, elem2) {
	return elem1 === elem2;
};

RewriteGroup.prototype.compare = function(elem1, elem2) {
	if(elem1.length < elem2.length)
		return -1;
	if(elem1.length > elem2.length)
		return 1;
	if(elem1 < elem2)
		return -1;
	if(elem1 > elem2)
		return 1;
	return 0;
};

ConcreteGroup.prototype = new Group();

//A class for groups with matrix representations in the appropriately-dimensioned space.
//Including the abstract representation as a property probably isn't the right way to do this,
//but I can't think of anything better so I'm doing it this way.
function ConcreteGroup(generators, abstractGroup) {
	Group.call(this);
	this.generators = [];
	for(var i = 0; i < generators.length; i++)
		this.generators.push([abstractGroup.generators[i], generators[i]]);
	this.abstractGroup = abstractGroup;
	this.dimension = generators[0].width();
};

ConcreteGroup.prototype.identity = function() {
	return [this.abstractGroup.identity(), Matrix.identity(this.dimension)];
};

ConcreteGroup.prototype.multiply = function(elem1, elem2) {
	return [this.abstractGroup.multiply(elem1[0], elem2[0]), elem1[1].multiply(elem2[1])];
};

ConcreteGroup.prototype.invert = function(elem) {
	return [this.abstractGroup.invert(elem[0]), elem[1].inverse()];
};

//The representation may behave completely differently from the abstract group,
//so it isn't worth trusting
ConcreteGroup.prototype.equal = function(elem1, elem2) {
	return this.abstractGroup.equal(elem1[0], elem2[0]);
};

ConcreteGroup.prototype.compare = function(elem1, elem2) {
	return this.abstractGroup.compare(elem1[0], elem2[0]);
};

ConcreteGroup.BC = function(n) {
	var symmetryGens = [];
	//TODO: Find a better way to make these matrices
	var fourNode = Matrix.identity(n);
	fourNode.els[0][0] = -1;
	symmetryGens.push(fourNode);
	for(var i = 0; i < n - 1; i++) {
		var flipNode = Matrix.identity(n);
		flipNode.els[i][i] = 0;
		flipNode.els[i + 1][i] = 1;
		flipNode.els[i][i + 1] = 1;
		flipNode.els[i + 1][i + 1] = 0;
		symmetryGens.push(flipNode);
	}
	//Using a RewriteGroup here might be better but generating those is slightly unpleasant
	var abstractSymmetries = new MatrixGroup(symmetryGens);
	//3D and 4D RewriteGroups for for debugging toPolytopeS.
	//abstractSymmetries = new RewriteGroup("012",[["00",""],["11",""],["22",""],["1010","0101"],["20","02"],["212","121"],["2102","1210"],["210121","121012"]])
	abstractSymmetries = new RewriteGroup("0123",[["00",""],["11",""],["22",""],["33",""],["1010","0101"],["20","02"],["30","03"],["212","121"],["31","13"],["323","232"],["2102","1210"],["3213","2321"],["32103","23210"],["210121","121012"],["321013","232101"],["32101232","23210123"]]);
	console.warn("Dimensional special case enabled.");
	return new ConcreteGroup(symmetryGens, abstractSymmetries);
};
