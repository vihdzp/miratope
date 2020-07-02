"use strict";
//A constructionNode represents how a polytope has been built up.
//It consists of a type and children.
//Children are arrays of objects, oftentimes nodes, the specific objects depend on the node type.
//They're essentially what the node "operates" on.
//The types are given below:

//Has a single PolytopeC as a child.
const POLYTOPEC = 0;
//Has a single PolytopeS as a child.
const POLYTOPES = 1;
//Has the nodes representing the factors of a prism product as children.
const MULTIPRISM = 2;
//Represents an antiprism based on the child node.
const ANTIPRISM = 3;
//Has a single child from which a pyramid is built.
const PYRAMID = 4;
//Has a single child from which a cupola is built.
const CUPOLA = 5;
//Has two children n, d, representing the regular polygonal small base {n/d}.
const CUPLOID = 6;
//Has two children n, d, representing the regular polygonal base {n/d}.
const CUPBLEND = 7;
//Has two children n, d, representing the regular polygonal base {n/d}.
const POLYGON = 8;
//Has a single string as a child, representing a polytope's name in Miratope's library.
const NAME = 9;

function ConstructionNode(type, children) {
	this.type = type;
	this.children = children;
	
	switch(type) {
		case POLYGON: //The gender of the plain polygon names
		case POLYTOPEC: //The gender of the plain n-tope names.
		case MULTIPRISM: //The gender of the word "multiprism".
		case ANTIPRISM: //The gender of the word "antiprism".
			switch(LANGUAGE) {
				case SPANISH: this.gender = MALE; break;
				case GERMAN: this.gender = NEUTER; break;
				default: break;
			}
			break;
		case PYRAMID: //The gender of the word "pyramid".
		case CUPOLA: //The gender of the word "cupola".
			switch(LANGUAGE) {
				case SPANISH:
				case GERMAN: this.gender = FEMALE; break;
				default: break;;
			}
			break;
		case CUPBLEND: //The gender of the word "cupolaic blend".
			switch(LANGUAGE) {
				case SPANISH: this.gender = FEMALE; break;
				default: break;;
			}
			break;
		case CUPLOID: //The gender of the word "cuploid".
			switch(LANGUAGE) {
				case SPANISH: this.gender = MALE; break;
				default: break;;
			}
			break;
	}
	
	this.setGenders();
};

ConstructionNode.prototype.getName = function() {
	switch(this.type) {		
		case POLYTOPEC:
			var poly = this.children[0];
			return Translation.plain(poly.elementList[poly.elementList.length - 2].length, poly.dimensions);
		case MULTIPRISM:
			//A multiprism of multiprisms is just a larger multiprism.
			var oldLength = this.children.length;
			for(var i = 0; i < oldLength; i++) {
				if(this.children[i].type === MULTIPRISM) {
					for(var j = 0; j < this.children[i].children.length - 1; j++)
						this.children.push(this.children[i].children.pop());
					this.children[i] = this.children[i].children.pop();
				}
			}
			return Translation.multiprism(this.children);
		case ANTIPRISM:
			return Translation.familyMember(this.children[0], "antiprism", this.gender);
		case PYRAMID:
			return Translation.familyMember(this.children[0], "pyramid", this.gender);
		case CUPOLA:		
			return Translation.familyMember(this.children[0], "cupola", this.gender);
		case CUPLOID:		
			return Translation.familyMember(this.children[0], "cuploid", this.gender);
		case CUPBLEND:		
			return Translation.familyMember(this.children[0], "cupolaicBlend", this.gender);
		case POLYGON:
			return Translation.regularPolygonName(this.children[0], this.children[1], 0, this.gender);
		case NAME:
			return Translation.get(this.children[0]);
		default:
			throw new Error("Not yet implemented!");
	}
};

//Sets the gender of the noun representing the polytope type at all children nodes.
//e.g. in Spanish, we'd say "prisma cupoidal pentagrámico cruzado", not 
//"prisma cupoidal pentagrámica cruzada"; even though "cúpula" is femenine,
//the male "prisma" takes over.
ConstructionNode.prototype.setGenders = function() {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.setGenders) {
			child.gender = this.gender;
			child.setGenders();
		}
	}
};