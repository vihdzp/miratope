"use strict";

function Polytope(construction) {
	if(!construction)
		this.construction = new ConstructionNode(this);
	else
		this.construction = construction;
};

Polytope.prototype.getName = function() {
	return this.construction.getName();
};