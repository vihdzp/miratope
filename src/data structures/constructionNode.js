"use strict";

//A ConstructionNode represents how a polytope has been built up
//ConstructionNodes come in types, and can have children
//"Children" are arrays containing objects, the specific objects depend on the node type
//Usually these objects are other nodes, but they can also be numbers or Polytopes.
//Children are essentially what a nodeC operates on
//The types of node and their case number are given below:

//Has two children n, d,
//representing the number of facets n and number of dimensions d.
const PLAIN = 0;

//Has the factors of a prism product as children.
const MULTIPRISM = 1;

//Has the factors of a tegum product as children.
const MULTITEGUM = 2;

//Has the factors of a pyramid product as children.
const MULTIPYRAMID = 3;

//Has an antiprism based on the child node.
const ANTIPRISM = 4;

//Has a pyramid based on the child node.
const PYRAMID = 5;

//Has a cupola based on the child node.
const CUPOLA = 6;

//Has two children n, d,
//representing the regular polygonal small base {n/d}.
const CUPLOID = 7;

//Has two children n, d,
//representing the regular polygonal base {n/d}.
const CUPBLEND = 8;

//Has two children n, d,
//representing the regular polygonal base {n/d}.
const POLYGON = 9;

//Has a polytope's "code name" as a child.
//Used for polytopes whose names are in loadMessages.js, and can be translated.
const CODENAME = 10;

//Has a polytope's name as a child.
//The default for imported polytopes, or polytopes not built out of anything else whose name is known.
//IS NOT translated.
const NAME = 11;

//Has the dimension of the figure as a child.
const HYPERCUBE = 12;
const SIMPLEX = 13;
const CROSS = 14;

//Creates a ConstructionNode of a certain type and with certain children
function ConstructionNode(type, children) {
	this.type = type;
	this.children = children;
	this.setGenders();
};

//Gets the name of a ConstructionNode based on type
ConstructionNode.prototype.getName = function() {
	switch(this.type) {
		case PLAIN:
			return Translation.plainName(this.children[0], this.children[1]);
		case MULTIPRISM:
			this.mergeChildren();
			return Translation.multiFamily(this.children, "family/prism", "shape/dyad", "family/prism", this.gender);
		case MULTITEGUM:
			this.mergeChildren();
			return Translation.multiFamily(this.children, "family/tegum", "shape/dyad", "family/bipyramid", this.gender);
		case MULTIPYRAMID:
			this.mergeChildren();
			return Translation.multiFamily(this.children, "family/pyramid", "shape/point", "family/pyramid", this.gender);
		case ANTIPRISM:
			return Translation.familyMember(this.children, "family/antiprism", this.gender);
		case PYRAMID:
			return Translation.familyMember(this.children, "family/pyramid", this.gender);
		case CUPOLA:
			return Translation.familyMember(this.children, "family/cupola", this.gender);
		case CUPLOID:
			return Translation.familyMember(this.children[0], "family/cuploid", this.gender);
		case CUPBLEND:
			return Translation.familyMember(this.children[0], "family/cupolaicBlend", this.gender);
		case POLYGON:
			return Translation.regularPolygonName(this.children[0], this.children[1], {gender: this.gender});
		case CODENAME:
			return Translation.get("shape/" + this.children);
		case NAME:
			return this.children;
		case HYPERCUBE:
			return Translation.hypercube(this.children);
		case SIMPLEX:
			return Translation.simplex(this.children);
		case CROSS:
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
		case POLYGON: //The gender of the plain polygon names
		case PLAIN: //The gender of the plain polytope names
		case MULTIPRISM: //The gender of the word "multiprism"
		case ANTIPRISM: //The gender of the word "antiprism"
		case MULTITEGUM: //The gender of the word "multitegum"
			switch(Translation.language) {
				case "es": this.gender = "male"; break;
				case "de": this.gender = "neuter"; break;
				default: break;
			}
			break;
		case PYRAMID: //The gender of the word "pyramid"
		case CUPOLA: //The gender of the word "cupola"
			switch(Translation.language) {
				case "es":
				case "de": this.gender = "female"; break;
				default: break;
			}
			break;
		case CUPBLEND: //The gender of the word "cupolaic blend"
			switch(Translation.language) {
				case "es": this.gender = "female"; break;
				default: break;
			}
			break;
		case CUPLOID: //The gender of the word "cuploid"
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
