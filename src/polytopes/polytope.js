"use strict";

function Polytope(construction) {
	if(!construction)
		this.construction = new ConstructionNode(POLYTOPEC, [this]);
	else
		this.construction = construction;
};

Polytope.prototype.getName = function() {
	return this.construction.getName();
};