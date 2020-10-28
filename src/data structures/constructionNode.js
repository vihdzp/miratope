"use strict";

/**
 * An object containing the possible types of {@link ConstructionNode|ConstructionNodes}.
 * @enum {number}
 */
const ConstructionNodeType = {
	/** Has two children `[n, d]`,
	 * representing the number of facets `n`
	 * and the number of dimensions `d` of the polytope.
	 */
	Plain: 0,

	//Has the factors of a prism product as children.
	Multiprism: 1,

	//Has the factors of a tegum product as children.
	Multitegum: 2,

	//Has the factors of a pyramid product as children.
	Multipyramid: 3,

	//Has an antiprism based on the child node.
	Antiprism: 4,

	//Has a pyramid based on the child node.
	Pyramid: 5,

	//Has a cupola based on the child node.
	Cupola: 6,

	//Has two children n, d,
	//representing the regular polygonal small base {n/d}.
	Cuploid: 7,

	//Has two children n, d,
	//representing the regular polygonal base {n/d}.
	CupolaicBlend: 8,

	//Has two children n, d,
	//representing the regular polygonal base {n/d}.
	Polygon: 9,

	//Has a polytope's "code name" as a child.
	//Used for polytopes whose names are in loadMessages.js, and can be translated.
	Codename: 10,

	//Has a polytope's name as a child.
	//The default for imported polytopes, or polytopes not built out of anything else whose name is known.
	//IS NOT translated.
	Name: 11,

	//Has the dimension of the figure as a child.
	Hypercube: 12,
	Simplex: 13,
	Cross: 14
};

/**
 * The constructor for the ConstructionNode class.
 * @constructor
 * @classdesc A ConstructionNode represents how a polytope has been built up.
 * ConstructionNodes come in various types, and always have at least one child.
 * Depending on the node type, these children can either be single objects,
 * or arrays of ConstructionNodes or other objects.<br />
 * &emsp;The possible node types and their descriptions are given in {@link ConstructionNodeType}.
 * @param {ConstructionNodeType} type The ConstructionNode type.
 * @param {Object} children The child or children of the node. The type of this variable depends on the ConstructionNode type.
 */
//Creates a ConstructionNode of a certain type and with certain children
function ConstructionNode(type, children) {
	this.type = type;
	this.children = children;
	this.setGenders();
};

//Gets the name of a ConstructionNode based on type
ConstructionNode.prototype.getName = function() {
	switch(this.type) {
		case ConstructionNodeType.Plain:
			return Translation.plainName(this.children[0], this.children[1]);
		case ConstructionNodeType.Multiprism:
			this.mergeChildren();
			return Translation.multiFamily(this.children, "family/prism", "shape/dyad", "family/prism", this.gender);
		case ConstructionNodeType.Multitegum:
			this.mergeChildren();
			return Translation.multiFamily(this.children, "family/tegum", "shape/dyad", "family/bipyramid", this.gender);
		case ConstructionNodeType.Multipyramid:
			this.mergeChildren();
			return Translation.multiFamily(this.children, "family/pyramid", "shape/point", "family/pyramid", this.gender);
		case ConstructionNodeType.Antiprism:
			return Translation.familyMember(this.children, "family/antiprism", this.gender);
		case ConstructionNodeType.Pyramid:
			return Translation.familyMember(this.children, "family/pyramid", this.gender);
		case ConstructionNodeType.Cupola:
			return Translation.familyMember(this.children, "family/cupola", this.gender);
		case ConstructionNodeType.Cuploid:
			return Translation.familyMember(this.children[0], "family/cuploid", this.gender);
		case ConstructionNodeType.CupolaicBlend:
			return Translation.familyMember(this.children[0], "family/cupolaicBlend", this.gender);
		case ConstructionNodeType.Polygon:
			return Translation.regularPolygonName(this.children[0], this.children[1], {gender: this.gender});
		case ConstructionNodeType.Codename:
			return Translation.get("shape/" + this.children);
		case ConstructionNodeType.Name:
			return this.children;
		case ConstructionNodeType.Hypercube:
			return Translation.hypercube(this.children);
		case ConstructionNodeType.Simplex:
			return Translation.simplex(this.children);
		case ConstructionNodeType.Cross:
			return Translation.cross(this.children);
		default:
			throw new Error("Not yet implemented!");
	}
};

//Sets the gender of the noun representing the polytope type at all children nodes.
//e.g. in Spanish, we'd say "prisma cupoidal pentagrámico cruzado", not
//"prisma cupoidal pentagrámica cruzada"; even though "cúpula" is femenine,
//the male "prisma" takes over.
ConstructionNode.prototype.setGenders = function() {
	if(!Translation.genderedLanguage) return;

	switch(this.type) {
		case ConstructionNodeType.Polygon: //The gender of the plain polygon names
		case ConstructionNodeType.Plain: //The gender of the plain polytope names
		case ConstructionNodeType.Multiprism: //The gender of the word "multiprism"
		case ConstructionNodeType.Antiprism: //The gender of the word "antiprism"
		case ConstructionNodeType.Multitegum: //The gender of the word "multitegum"
			switch(Translation.language) {
				case "es": this.gender = "male"; break;
				case "de": this.gender = "neuter"; break;
				default: break;
			}
			break;
		case ConstructionNodeType.Pyramid: //The gender of the word "pyramid"
		case ConstructionNodeType.Cupola: //The gender of the word "cupola"
			switch(Translation.language) {
				case "es":
				case "de": this.gender = "female"; break;
				default: break;
			}
			break;
		case ConstructionNodeType.CupolaicBlend: //The gender of the word "cupolaic blend"
			switch(Translation.language) {
				case "es": this.gender = "female"; break;
				default: break;
			}
			break;
		case ConstructionNodeType.Cuploid: //The gender of the word "cuploid"
			switch(Translation.language) {
				case "es": this.gender = "male"; break;
				default: break;
			}
			break;
	}

	this._setGenders();
};

//Auxiliary function for setGenders.
ConstructionNode.prototype._setGenders = function() {
	//If the node has a single child:
	if(!this.children.length && this.children._setGenders) {
		this.children.gender = this.gender;
		this.children._setGenders();
	}
	//If the node has an array of children:
	else {
		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if(child._setGenders) {
				child.gender = this.gender;
				child._setGenders();
			}
		}
	}
};

//A multiprism of multiprisms is just a larger multiprism,
//a multitegum of multitegums is just a larger multitegum, etc.
//This function removes children nodes of the same type,
//and replaces them by their children.
ConstructionNode.prototype.mergeChildren = function() {
	var oldLength = this.children.length;
	for(var i = 0; i < oldLength; i++) {
		if(this.children[i].type === this.type) {
			for(var j = 0; j < this.children[i].children.length - 1; j++)
				this.children.push(this.children[i].children.pop());
			this.children[i] = this.children[i].children.pop();
		}
	}
}
