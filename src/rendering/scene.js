"use strict";

//Class for drawing objects to the scene more efficiently. 
function Scene(scene) {
	if(scene !== undefined)
		this.scene = scene;
	else
		this.scene = new THREE.Scene();
};

//Material for the faces.
Scene.material = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, flatShading: true});

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
	var triangle = new THREE.Mesh( geometry, material );
	this.scene.add( triangle );  
};

//Adds a face to the scene.
//The face is an array of simple polygons that together, form the face.
//This code figures out which of these faces need to be rendered,
//and transforms the points into 3D. (or at least will when it's fully functional).
Scene.prototype.add = function(face) {
	var _poly = face[0], //A simple polygon of which the face is composed.
	poly = [];           //The face projected into 3D, as an array of THREE.Vector3s.
	
	//Here's where I'm supposed to project the face into 3D via the projection matrix.
	
	//These are the analogs of window.index0 and window.index1 for the projected face.
	//(at the moment, I just use the old values, since I'm not doing any projection yet)
	//window.index0 = something; window.index1 = something;
	
	//The last coordinate.
	window.index2 = 3 - window.index0 - window.index1;
	
	for(var i = 0; i < _poly.length; i++) {
		poly.push(new THREE.Vector3(
			_poly[i].coordinates[window.index0],
			_poly[i].coordinates[window.index1],
			_poly[i].coordinates[window.index2])
		);
	}
	
	this._renderHoledPolygon(poly);
};

Scene.prototype._renderHoledPolygon = function(poly, hole) {
	//The vertices of the polygon and the holes can be loaded either in correct or inverse order.
	//I edited the three.js source code so that is stores whether each polygon is correct or reversed.
	window._polyReversed = false;
	
	//Probably won't work.
	var shape = new THREE.Shape(poly);
	if(hole)
		shape.holes.push(new THREE.Shape(hole));
	
	var geometry = new THREE.ShapeBufferGeometry(shape);	
	
	//Reorders vertices and extrudes into 3D appropriately.
	var a;
			
	for(var i = 0; i < poly.length; i++) {
		a = [];
		a[window.index0] = geometry.attributes.position.array[3 * i];
		a[window.index1] = geometry.attributes.position.array[3 * i + 1];
		if(window._polyReversed)
			a[window.index2] = poly[geometry.attributes.position.count - i - 1].z;
		else 
			a[window.index2] = poly[i].z;
		for(var j = 0; j < 3; j++) {
			geometry.attributes.position.array[3 * i + j] = a[j];
		}
	}
	
	geometry.attributes.position.needsUpdate = true;
	
	geometry.computeVertexNormals();
	
	this.scene.add(
		new THREE.Mesh(
			geometry, 
			Scene.material
		)
	);
};
	
Scene.prototype.clear = function() {
	while(this.scene.children.length > 0) {
		if(this.scene.children[0].type === "Mesh")
			this.scene.children[0].geometry.dispose();
		
		this.scene.remove(this.scene.children[0]);
	}
	
	this.scene.add(ambientLight);
	this.scene.add(directionalLight);
};