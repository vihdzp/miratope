//Made with 3D polyhedra in mind.
//Will probably have to implement other more complicated stuff for other dimensions.
//Implements Bentley-Ottmann, based on the implementation at
//http://geomalgorithms.com/a09-_intersect-3.html#Bentley-Ottmann-Algorithm
//combined with the simplification algorithm at
//https://web.archive.org/web/20100805164131if_/http://www.cis.southalabama.edu/~hain/general/Theses/Subramaniam_thesis.pdf
//to triangulate general polygons.
//NOT YET FULLY IMPLEMENTED!
Polytope.prototype.renderTo = function(scene) {
	var P = this.toPolytopeC().recenter();

	function debug() {
		var x = 0;
		console.log(E.value.coordinates[window.index0].toString());
		console.log(SL.toString());
	}

	//Orders two points lexicographically based on the coordinates on indices 0 and 1.
	//Uses the IDs of the vertices to order them consistently if their coordinates are identical.
	function order(a, b) {
		var c = a.value.coordinates[window.index0] - b.value.coordinates[window.index0];
		if(c === 0) { //DO NOT REPLACE BY Math.abs(c) < epsilon
			c = a.value.coordinates[window.index1] - b.value.coordinates[window.index1];
			if(c === 0)
				return a.id - b.id;
		}
		return c;
	}

	//SL is sorted by the height of the edges' intersections with the sweepline.
	//If these are equal, the lines are sorted by slope.
	//If both are equal, the lines are consistently ordered by their IDs (unique, immutable identifiers).
	function SLSort(x, y){
		//This is the only case where the function should return 0:
		if(x.leftVertex === y.leftVertex && x.rightVertex() === y.rightVertex())
			return 0;

		var a = x.leftVertex.value,
		b = x.rightVertex().value,
		c = y.leftVertex.value,
		d = y.rightVertex().value,
		k = E.value.coordinates[window.index0], slopeMod;

		//Calculates where in the segments the intersection with the sweepline lies.
		var lambda0 = (k - b.coordinates[window.index0])/(a.coordinates[window.index0] - b.coordinates[window.index0]);
		var lambda1 = (k - d.coordinates[window.index0])/(c.coordinates[window.index0] - d.coordinates[window.index0]);

		//The height difference between the intersections.
		var res = (a.coordinates[window.index1] * lambda0 + b.coordinates[window.index1] * (1 - lambda0)) - (c.coordinates[window.index1] * lambda1 + d.coordinates[window.index1] * (1 - lambda1));

		//If the intersections are so similar, we also need to consider the possibility
		//that the edges actually have a common endpoint.
		if (Math.abs(res) < epsilon) {
			//If the first edge starts at a point, and the second ends at that point, the former gets sorted after the latter.
			if(lambda0 > 1 - epsilon && lambda1 < epsilon)
				return 1;
			//And viceversa.
			if(lambda0 < epsilon && lambda1 > 1 - epsilon)
				return -1;

			//If both edges start at the same point, sort by increasing slope.
			if(lambda0 > 1 - epsilon)
				slopeMod = 1;
			//If both edges end at the same point, sort by decreasing slope.
			else if(lambda0 < epsilon)
				slopeMod = -1;
			//The edges are just really close, so compare them normally.
			else
				return res;

			//The difference between the slopes.
			res = slopeMod * (Math.atan(x.slope) - Math.atan(y.slope));

			//If both lines are the same, might as well compare using indices.
			if(Math.abs(res) < epsilon)
				return x.id - y.id;
		}
		return res;
	};

	var j, k;

	//For each face:
	faceLoop:
	for(var i = 0; i < P.elementList[2].length; i++){
		//Let's not even bother with digons and monogons.
		if(P.elementList[2][i].length < 3)
			continue faceLoop;
	/*	if(P.elementList[2][i].length === 3) {
			//All triangles are convex, so cut to the chase and render it directly.
		} */

		//Enumerates the vertices in order.
		var cycle = P.faceToVertices(i);

		//Makes a doubly-linked list vertexDLL for the polygon's vertices and the new vertices created.
		//node0 is always the "next" vertex.
		var vertexDLL = [new LinkedListNode(P.elementList[0][cycle[0]])];
		for(j = 0; j < cycle.length - 1; j++) {
			vertexDLL[j + 1] = new LinkedListNode(P.elementList[0][cycle[j + 1]]);
			vertexDLL[j].linkToNext(vertexDLL[j + 1]);
		}
		vertexDLL[vertexDLL.length - 1].linkToNext(vertexDLL[0]);

		//Tries to find two non-equal points. If all points are the same, doesn't render the face.
		var a = 1;
		while(Point.equal(vertexDLL[0].value, vertexDLL[a].value))
			if(++a >= vertexDLL.length)
				continue faceLoop;

		//Tries to find three non-collinear points. If all points are collinear, doesn't render the face.
		var b = (a === 1 ? 2 : 1);
		while(Space.collinear(vertexDLL[0].value, vertexDLL[a].value, vertexDLL[b].value))
			if(++b >= vertexDLL.length)
				continue faceLoop;

		//Calculates the coordinates such that the projection of our three non-collinear points onto their 2D plane has the highest area.
		//Uses the shoelace formula.
		//Stores such coordinates' indices in window.index0, window.index1.
		//That way, they become global variables that can be used elsewhere.
		var maxArea = 0,
		Area,
		va = vertexDLL[a].value,
		vb = vertexDLL[b].value,
		v0 = vertexDLL[0].value;
		window.index0 = 0;
		window.index1 = 1;
		for(j = 0; j < v0.dimensions(); j++) {
			for(k = j + 1; k < v0.dimensions(); k++) {
				if((Area = Math.abs(
					v0.coordinates[j] * (va.coordinates[k] - vb.coordinates[k])
					+ va.coordinates[j] * (vb.coordinates[k] - v0.coordinates[k])
					+ vb.coordinates[j] * (v0.coordinates[k] - va.coordinates[k])
				))
				> maxArea) {
					window.index0 = j;
					window.index1 = k;
					maxArea = Area;
				}
			}
		}

		//Event queue for Bentley-Ottmann, stores vertices.
		//Sorts EQ by lexicographic order of the vertices (EQ is read backwards at the moment).

		var EQ = new AvlTree(order);
		for(j = 0; j < vertexDLL.length; j++)
			EQ.insert(vertexDLL[j]);

		//Sweep line for Bentley-Ottmann, as an object with properties leftVertex and rightVertexIndex.
		//rightVertexIndex should be 0 if leftVertex.node0.value is to the right of leftVertex.value, 1 if leftVertex.node1.value is.
		//This format is useful because an edge on the sweep line can only be cut to the right.
		//That way, we don't need to modify the SL objects after the division process: only the nodes' connections change.

		var SL = new AvlTree(SLSort),counter=0;

		//Bentley-Ottmann:
		while(!EQ.isEmpty()) {
			counter++;
			var E = EQ.findMinimum(); //The next "event" in the event queue.
			EQ.delete(E);
			if(!SL.checkSorted()) { //If the code worked perfectly, we could skip this part.
				alert("Something went wrong!");
				//return; //Uncomment if you want the code not to throw an exception.
			}

			//Runs P code on both edges adjacent to E's vertex.
			for(j = 0; j <= 1; j++) {
				var edge; //E's edge in the SL format.
				var ord = E.value.coordinates[window.index0] - E.getNode(j).value.coordinates[window.index0];
				var pos = 0;
				var node, prevNode, nextNode;

				//Vertex E is a left endpoint of the edge:
				if(ord < -epsilon) {
					edge = new SweeplineEdge(E, j);
					node = SL.insert(edge);
					if(!node) {
						console.log("SL insertion failed! This isn't supposed to happen!");
						console.log("Edge searched for: " + edge.toString());
						console.log("Debug stuff:");
						debug();
					}
					prevNode = SL.prev(node);
					nextNode = SL.next(node);

					if(prevNode)
						Polytope._divide(edge, prevNode.key, vertexDLL, EQ); //Checks for an intersection with the edge below edgeE.
					if(nextNode)
						Polytope._divide(edge, nextNode.key, vertexDLL, EQ); //Checks for an intersection with the edge above edgeE.
				}
				//Vertex E is a right endpoint of the edge:
				else if (ord > epsilon) {
					edge = new SweeplineEdge(E.getNode(j), 1 - j);

					//Deletes edge from the sweep line.
					node = SL.getNode(edge);
					if(!node) {
						console.log("SL retrieval failed! This isn't supposed to happen!");
						console.log("Edge searched for: " + edge.toString());
						console.log("Debug stuff:");
						debug();
					}
					prevNode = SL.prev(node);
					nextNode = SL.next(node);

					if(prevNode && nextNode)
						Polytope._divide(prevNode.key, nextNode.key, vertexDLL, EQ); //Checks for an intersection between the edges below and above edgeE.
					SL.delete(edge);
				}
				//The edge is perpendicular to the first coordinate's axis:
				//Runs only once per such an edge.
				else if(E.value.coordinates[window.index1] > E.getNode(j).value.coordinates[window.index1]) {
					edge = new SweeplineEdge(E, j);

					//I really should only check intersections with segments at the "correct height".
					node = SL.findMinimumNode();
					while(node) {
						Polytope._divide(edge, node.key, vertexDLL, EQ);
						node = SL.next(node);
					}
				}
			}
		}

		//Polygons composing a single face as ordered sets of vertices.
		var face = [];

		//Retrieves polygonal paths from edges.
		for(j = 0; j < vertexDLL.length; j++) {
			if(!vertexDLL[j].traversed)
				face.push(vertexDLL[j].getCycle());
		}

		//The rest of the rendering shenanigans are handled by the Scene class.
		scene.add(face);
	}

	scene.polytopes.push(this);
};

//renderTo helper function.
//"Cuts" edgeA and edgeB at the intersection point, adds the new directed edges according to the simplification algorithm.
//Edges are in the SL format.
Polytope._divide = function(edgeA, edgeB, vertexDLL, EQ) {
	//No point in doing anything if the intersection has already been dealt with.
	//...what happens if two different vertices take the same location?
	if(edgeA.leftVertex.value === edgeB.leftVertex.value || edgeA.leftVertex.value === edgeB.rightVertex().value ||
	edgeA.rightVertex().value === edgeB.leftVertex.value || edgeA.rightVertex().value === edgeB.rightVertex().value)
		return;

	//Converts edges from the SL format to the [vertex1, vertex2] directed edge format.
	var edgeADir, edgeBDir;
	if(edgeA.rightVertexIndex === 0)
		edgeADir = [edgeA.leftVertex, edgeA.leftVertex.node0];
	else
		edgeADir = [edgeA.leftVertex.node1, edgeA.leftVertex];
	if(edgeB.rightVertexIndex === 0)
		edgeBDir = [edgeB.leftVertex, edgeB.leftVertex.node0];
	else
		edgeBDir = [edgeB.leftVertex.node1, edgeB.leftVertex];

	//No point in doing anything if the intersection is non-existent.
	var inter = Space.intersect(edgeADir[0].value, edgeADir[1].value, edgeBDir[0].value, edgeBDir[1].value);
	if(inter === null)
		return;

	//Add the intersection and a point at "infinitesimal distance" to the vertex list.
	//They don't actually have to be different in this implementation of the algorithm.
	//In fact, the algorithm (as implemented) will fail if both nodes don't reference the same point.
	var newNode1 = new LinkedListNode(inter); var newNode2 = new LinkedListNode(inter);
	vertexDLL.push(newNode1); vertexDLL.push(newNode2);

	//Re-links the vertices.
	edgeADir[0].linkToNext(newNode1);
	newNode1.linkToNext(edgeBDir[1]);
	edgeBDir[0].linkToNext(newNode2);
	newNode2.linkToNext(edgeADir[1]);

	//Adds the edges' new IDs to the redirect table, so that they remain equal and consistent.
	edgeA.updateID();
	edgeB.updateID();

	EQ.insert(newNode1);
	EQ.insert(newNode2);
};
