"use strict";

//Class for drawing objects to the scene more efficiently.
function Scene() {
	//Defines scene.
	this.scene = new THREE.Scene();
	this.polytopes = [];

	//Defines renderer.
	this.renderer = new THREE.WebGLRenderer({antialias:true});
	this.renderer.setSize( window.innerWidth, window.innerHeight - 44);
	document.body.appendChild( this.renderer.domElement );

	//Adds and configures the camera.
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	this.camera.position.z = 2;

	//Adds both ambient light and directional light.
	this.ambientLight = new THREE.AmbientLight( 0x777777, 0.8);
  this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	this.directionalLight.position.set( 1,1,1 ).normalize();
	this.scene.add( this.ambientLight );
	this.scene.add( this.directionalLight );

	//Sets material.
	this.material = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, flatShading: true});

	//Sets up controls.
	this.controls = new TrackballControls(this.camera, this.renderer.domElement);
	this.controls.target.set(0, 0, 0);
	this.controls.rotateSpeed = 4;
	this.controls.update();
};

//Adds a face to the scene.
//The face is an array of simple polygons that together, form the face.
//This code figures out which of these faces need to be rendered,
//and transforms the points into 3D. (or at least will when it's fully functional).
Scene.prototype.add = function(face) {
	var _poly = face[0], //A simple polygon of which the face is composed (temporary rendering).
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

//Renders a polygon with a hole.
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
			this.material
		)
	);
};

//Clears and disposes of everything in the scene, except for the lighting.
Scene.prototype.clear = function() {
	while(this.scene.children.length > 0) {
		if(this.scene.children[0].type === "Mesh")
			this.scene.children[0].geometry.dispose();

		this.scene.remove(this.scene.children[0]);
	}

	this.scene.add(this.ambientLight);
	this.scene.add(this.directionalLight);

	this.polytopes = [];
};
