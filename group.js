//A class for abstract groups.
class Group {
	constructor() {
	}
}
//A class for groups defined using matrices.
class MatrixGroup extends Group {
	constructor(generators) {
		super();
		this.generators = generators;
		this.dimension = generators[0].width();
	}

	identityElement() {
		return Matrix.identity(this.dimension);
	}

	multiplyElements(elem1, elem2) {
		return elem1.multiply(elem2);
	}

	invertElement(elem) {
		return elem1.inverse();
	}
}
//A class for groups defined using normalizing rewriting systems.
class RewriteGroup extends Group {
	constructor(generators, system) {
		super();
		this.generators = generators;
		this.system = system;
	}

	simplifyElement(elem) {
		var oldElem = "";
		while(elem != oldElem){
			oldElem = elem;
			for(var i = 0; i < this.system.length; i++){
				elem = elem.replace(this.system[i][0], this.system[i][1]);
			}
		}
		return elem;
	}

	identityElement() {
		return "";
	}

	multiplyElements(elem1, elem2) {
		return this.simplifyElement(elem1 + elem2);
	}

	invertElement(elem) {
		var inverse = "";
		for(var i = 0; i < elem.length; i++) {
			inverse = elem[i] + inverse;
		}
		return inverse;
	}
}
//A class for groups with matrix representations in the appropriately-dimensioned space.
//Including the abstract representation as a property probably isn't the right way to do this,
//but I can't think of anything better so I'm doing it this way.
class ConcreteGroup extends Group {
	constructor(generators, abstractGroup) {
		this.generators = [];
		for(var i = 0; i < generators.length; i++)
			this.generators.push([abstractGroup.generators[i], generators[i]]);
		this.abstractGroup = abstractGroup;
		this.dimension = generators[0].width();
	}

	identityElement() {
		return [this.abstractGroup.identityElement(), Matrix.identity()];
	}

	multiplyElements(elem1, elem2) {
		return [this.abstractGroup.multiplyElements(elem1[0], elem2[0]), elem1[1].multiply(elem2[1])];
	}

	invertElement(elem) {
		return [this.abstractGroup.invertElement(elem[0]), elem[1].inverse()];
	}
}