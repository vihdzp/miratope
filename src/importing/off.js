"use strict";

//The part of the Polytope class for reading and writing to OFF files.

/**
 * Helper function for OFF importing.
 * Is called when the OFF file is loaded.
 * @private
 * @param {Object} e The event handler.
 */
Polytope._OFFReaderOnload = function(e) {
	var caret = new Caret(e.target.result), //Caret for reading the OFF file.
	component, //A component of the polytope.
	dimensions = caret.readNumber(), //The number of dimensions of the OFF file's polytope.
	el, //An element of the polytope.
	elCount = 0, //The number of facets in an element of the polytope.
	edgeList = [], //A dictionary mapping hashes of pairs of integers to edge indices.
	elementCount = [], //The amount of vertices, edges, faces... elementCount[1] goes unused except for the special case of 2D components.
	elementList = [[]], //The elements of the described polytope.
	face, //A face of the polytope.
	facets, //The list of facets of the polytope.
	i, j, x, y, t; //Temporary variables used in for loops.

	//The file just starts with OFF.
	if(isNaN(dimensions))
		dimensions = 3;

	//Checks that the word OFF is the next thing on the file.
	if(caret.readWord() !== "OFF")
		caret.throwError("invalidFile");

	//Nullitope
	if(dimensions === -1) {
		P = Polytope.nullitope();
		return;
	}

	//Point
	if(dimensions === 0) {
		P = Polytope.point();
		return;
	}

	//Reads vertex amount.
	if(dimensions >= 1) {
		elementCount.push(caret.readNumber());
		elementList.push([]);
	}

	//Reads face and edge amounts.
	if(dimensions >= 3) {
		elementCount.push(null, caret.readNumber());
		caret.readWord(); //We can't actually care about the edge amount, since Stella itself ignores it.
		elementList.push([], []);
	}

	//Reads component amount in the special 2OFF case.
	else if(dimensions === 2) {
		elementCount.push(null, caret.readNumber());
		elementList.push([]);
	}

	//Reads higher element amounts.
	for(i = 3; i < dimensions; i++) {
		elementCount.push(caret.readNumber());
		elementList.push([]);
	}

	//Adds vertices.
	for(i = 0; i < elementCount[0]; i++) {
		el = [];
		for(j = 0; j < dimensions; j++)
			el.push(caret.readNumber());
		elementList[0].push(new Point(el));
	}

	if(dimensions >= 2) {
		//Adds faces and edges (or compounds in the special case).
		for(i = 0; i < elementCount[2]; i++) {
			el = [];
			face = [];
			elCount = caret.readNumber();

			//Retrieves vertices.
			for(j = 0; j < elCount; j++)
				el.push(caret.readNumber());

			//Creates edges.
			for(j = 0; j < elCount - 1; j++) {
				//Orders the edge's vertices.
				x = el[j];
				y = el[j + 1];
				if(x < y) {
					t = x;
					x = y;
					y = t;
				}
				t = (x + y + 1) * (x + y) / 2 + y; //Cantor pairing function.
				if(edgeList[t] === undefined) {
					edgeList[t] = elementList[1].length;
					elementList[1].push([x, y]);
				}
				face.push(edgeList[t]);
			}
			//Last edge.
			x = el[0];
			y = el[el.length - 1];
			if(x < y) {
				t = x;
				x = y;
				y = t;
			}
			t = (x + y + 1) * (x + y) / 2 + y; //Cantor pairing function.
			if(edgeList[t] === undefined) {
				edgeList[t] = elementList[1].length;
				elementList[1].push([x, y]);
			}
			face.push(edgeList[t]);

			elementList[2].push(face);
		}
	}

	//Adds higher-dimensional elements.
	for(i = 3; i < dimensions; i++) {
		for(j = 0; j < elementCount[i]; j++) {
			el = [];
			elCount = caret.readNumber();
			for(t = 0; t < elCount; t++)
				el.push(caret.readNumber());
			elementList[i].push(el);
		}
	}

	//Gets components. The 1D case is trivial.
	if(dimensions === 1) {
		elementList[1].push([]);
		for(i = 0; i < elementCount[0]; i++)
			elementList[1][0].push(i);
	}

	//Gets components in higher dimensions, except in 2D, where they've already been retrieved.
	else if(dimensions >= 3) {
		//Graph of incidences between facets.
		var graph = [];
		facets = elementList[elementList.length - 2];
		for(i = 0; i < facets.length; i++)
			graph.push(new GraphNode(i));

		//Calculates incidences.
		for(i = 0; i < facets.length; i++)
			for(j = i + 1; j < facets.length; j++)
				if(Polytope._checkCommonElements(facets[i], facets[j]))
					graph[i].connectTo(graph[j]);

		//Gets components.
		for(i = 0; i < facets.length; i++) {
			component = graph[i].getComponent();
			if(component)
				elementList[elementList.length - 1].push(component);
		}
	}

	P = new PolytopeC(
		elementList,
		new ConstructionNode(
			ConstructionNodeType.Name,
			Polytope.fileName
		)
	);
};

//Helper function for OFF importing.
//Checks whether two arrays have a common element using a dictionary.
Polytope._checkCommonElements = function(a, b) {
	var vals = {}, i;
	vals[a[i]] = true;

	for(i = 1; i < a.length; i++) {
		if(vals[a[i]])
			return true;
		vals[a[i]] = true;
	}

	for(i = 0; i < b.length - 1; i++) {
		if(vals[b[i]])
			return true;
		vals[b[i]] = true;
	}

	return !!vals[b[i]];
};

//Saves the current polytope as an OFF file.
//If comments, the OFF file will contain comments dividing the different element types.
Polytope.prototype.saveAsOFF = function(comments) {
	var P = this.toPolytopeC(),
	i, j, coord, vertices;

	if(P.spaceDimensions > P.dimensions) {
		//Maybe automatically project the polytope?
		alert("The OFF format does not support polytopes in spaces with more dimensions than themselves.");
		return;
	}

	//The contexts of the OFF file, as an array of plaintext strings.
	var data = [],
	pluralAndUppercase = {plural: "many", uppercase: true};

	//Writes the element counts, and optionally, leaves a comment listing their names in order.
	switch(P.dimensions) {
		case 0: //LOL
			data.push("0OFF");
			break;
		case 1: //Also LOL
			data.push("1OFF\n");
			if(comments)
				data.push("# ", Translation.elementName(0, pluralAndUppercase), "\n");
			data.push(P.elementList[0].length, "\n");
			break;
		case 2:
			data.push("2OFF\n");
			if(comments)
				data.push("# ", Translation.elementName(0, pluralAndUppercase), ", ", Translation.get("misc/component", pluralAndUppercase), "\n");
			data.push(P.elementList[0].length, " ", P.elementList[2].length, "\n");
			break;
		case 3:
			data.push("OFF\n"); //For compatibility with Stella.
			if(comments)
				data.push("# ", Translation.elementName(0, pluralAndUppercase), ", ", Translation.elementName(2, pluralAndUppercase), ", ", Translation.elementName(1, pluralAndUppercase), "\n");
			data.push(P.elementList[0].length, " ", P.elementList[2].length, " ", P.elementList[1].length, "\n");
			break;
		default:
			data.push(P.dimensions, "OFF\n");
			if(comments) {
				data.push("# ", Translation.elementName(0, pluralAndUppercase), ", ", Translation.elementName(2, pluralAndUppercase), ", ", Translation.elementName(1, pluralAndUppercase));
				for(i = 3; i < P.dimensions; i++)
					data.push(", ", Translation.elementName(i, pluralAndUppercase));
				data.push("\n");
			}
			data.push(P.elementList[0].length, " ", P.elementList[2].length, " ", P.elementList[1].length, " ");
			for(i = 3; i < P.dimensions - 1; i++)
				data.push(P.elementList[i].length, " ");
			data.push(P.elementList[P.dimensions - 1].length, "\n");
	}

	//Adds vertices. Fills in zeros if spaceDimensions < dimensions.
	if(comments)
		data.push("\n# ", Translation.elementName(0, pluralAndUppercase), "\n");

	for(i = 0; i < P.elementList[0].length; i++) {
		for(j = 0; j < P.dimensions - 1; j++) {
			coord = P.elementList[0][i].coordinates[j];
			if(coord === undefined)
				data.push("0 ");
			else
				data.push(coord, " ");
		}
		coord = P.elementList[0][i].coordinates[P.dimensions - 1];
		if(coord === undefined)
			data.push("0\n");
		else
			data.push(coord, "\n");
	}

	//Adds faces, or copmonents for compound polygons.
	if(P.dimensions >= 2) {
		if(comments) {
			if(P.dimensions === 2)
				data.push("\n# ", Translation.get("misc/component", pluralAndUppercase), "\n");
			else
				data.push("\n# ", Translation.elementName(2, pluralAndUppercase), "\n");
		}
		for(i = 0; i < P.elementList[2].length; i++) {
			vertices = P.faceToVertices(i);
			data.push(P.elementList[2][i].length);
			for(j = 0; j < P.elementList[2][i].length; j++)
				data.push(" ", vertices[j]);
			data.push("\n");
		}
	}

	//Adds the rest of the elements.
	for(var d = 3; d < P.dimensions; d++) {
		if(comments)
			data.push("\n# ", Translation.elementName(d, pluralAndUppercase), "\n");
		for(i = 0; i < P.elementList[d].length; i++) {
			data.push(P.elementList[d][i].length);
			for(j = 0; j < P.elementList[d][i].length; j++)
				data.push(" ", P.elementList[d][i][j]);
			data.push("\n");
		}
	}

	Polytope.fileName = Translation.firstToUpper(P.getName()) + ".off";
	Polytope._saveBlob(new Blob(data, {type:"text/plain"}));
};
