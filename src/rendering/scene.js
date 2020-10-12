"use strict";

//Class for drawing objects to the scene more efficiently. 
function Scene(scene) {
	if(scene !== undefined)
		this.scene = scene;
	else
		this.scene = new THREE.Scene();
};

//This will probably get deleted soon.
Scene.prototype.renderTriangle = function(a,b,c) {
	var geometry = new THREE.BufferGeometry();
	var vertices = new Float32Array(a.project().concat(b.project().concat(c.project())));
	
	//Computes the normal as a cross product.
	var x = [vertices[3] - vertices[0], vertices[4] - vertices[1], vertices[5] - vertices[2]];
	var y = [vertices[6] - vertices[0], vertices[7] - vertices[1], vertices[8] - vertices[2]];
	var n = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
	var N = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
	var normals = new Float32Array([n[0]/N, n[1]/N, n[2]/N, n[0]/N, n[1]/N, n[2]/N, n[0]/N, n[1]/N, n[2]/N]);
	geometry.setAttribute('position',new THREE.BufferAttribute(vertices, 3));
	geometry.setAttribute('normal',new THREE.BufferAttribute(normals, 3));
	geometry.setIndex([0,1,2]);
	var triangle = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, flatShading: true}));
	this.scene.add( triangle );  
};

//Adds a face to the scene.
//The face is an array of simple polygons that together, form the face.
//This code figures out which of these faces need to be rendered,
//and transforms the points into 3D. (or at least will when it's fully functional).
Scene.prototype.add = function(face) {
	var simple = face[0];
	var simpleVec3 = [];
	
	for(var i = 0; i < simple.length; i++) {
		simpleVec3.push(new THREE.Vector3(...simple[i].coordinates));
	}
	
	this._renderHoledPolygon(simpleVec3);
};

Scene.prototype._renderHoledPolygon = function(poly, hole) {
	//The vertices of the polygon and the holes can be loaded either in correct or inverse order.
	//I edited the three.js source code so that is stores whether each polygon is correct or reversed.
	window._polyReversed = false;
	
	var shape = new THREE.Shape(poly);
	if(hole)
		shape.holes.push(new THREE.Shape(hole));
	
	var geometry = new THREE.ShapeBufferGeometry( shape );	
	
	//Extrudes vertices into 3D appropriately.
	if(window._polyReversed)
		for(var i = 0; i < poly.length; i++) 		
			geometry.attributes.position.array[3 * i + 2] = poly[geometry.attributes.position.count - i - 1].z;
	else 		
		for(var i = 0; i < poly.length; i++) 		
			geometry.attributes.position.array[3 * i + 2] = poly[i].z;
	
	geometry.attributes.position.needsUpdate = true;
	
	geometry.computeVertexNormals();
	
	this.scene.add(
		new THREE.Mesh(
			geometry, 
			new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, flatShading: true})
		)
	);
};
	
Scene.prototype.clear = function() {
	this.scene = new THREE.Scene();
};