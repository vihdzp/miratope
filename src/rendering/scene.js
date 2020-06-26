"use strict";

//Class for drawing objects to the scene more efficiently. 
function Scene(scene) {
	if(scene !== undefined)
		this.scene = scene;
	else
		this.scene = new THREE.Scene();
};

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
	
Scene.prototype.add = function(object) {
	this.scene.add(object);
};
	
Scene.prototype.clear = function() {
	this.scene = new THREE.Scene();
};