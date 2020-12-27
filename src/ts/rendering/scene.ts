import * as THREE from "three";
import { Point } from "../geometry/point";
import { Global } from "../global";
import { PolytopeB } from "../polytopes/polytopeTypes";
import { TrackballControls } from "./trackball-controls";
import { ShapeBufferGeometry_ } from "./shapeBufferGeometryMock";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * The constructor for the `Scene` class.
 * @classdesc Wrapper for a scene, an object that shows a polytope.
 * Class for drawing objects to the scene more efficiently.
 */
export class Scene {
  scene: THREE.Scene;
  polytopes: PolytopeB[];
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  material: THREE.MeshLambertMaterial;
  controls: TrackballControls;

  constructor() {
    //Defines scene.
    this.scene = new THREE.Scene();
    this.polytopes = [];

    //Defines renderer.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(globalThis.innerWidth, globalThis.innerHeight - 44);
    document.body.appendChild(this.renderer.domElement);

    //Adds and configures the camera.
    this.camera = new THREE.PerspectiveCamera(
      75,
      globalThis.innerWidth / globalThis.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 2;

    //Declares and adds both ambient light and directional light.
    this.ambientLight = new THREE.AmbientLight(0x777777, 0.8);
    this.directionalLight = new THREE.DirectionalLight(0x777777, 0.8);
    this.directionalLight.position.set(1, 1, -1).normalize();
    this.addLights();

    //Sets material.
    this.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    //Sets up controls.
    this.controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.target.set(0, 0, 0);
    this.controls.rotateSpeed = 4;
    this.controls.update();
  }

  /**
   * Adds the ambient light and the directional light, fixed w.r.t the scene.
   */
  private addLights(): void {
    this.scene.add(this.ambientLight);
    this.camera.add(this.directionalLight);
    this.scene.add(this.camera);
  }

  /** Adds a face to the scene.
   * The face is an array of simple polygons that together, form the face.
   * This code figures out which of these faces need to be rendered,
   * and transforms the points into 3D. (or at least will when it's fully
   * functional).
   * @todo Make the code fully functional.
   */
  add(face: Point[][]): void {
    //A simple polygon of which the face is composed (temporary rendering).
    const _poly = face[0],
      //The face projected into 3D, as an array of THREE.Vector3s.
      poly2D: THREE.Vector2[] = [];

    //Here's where I'm supposed to project the face into 3D via the projection
    //matrix.

    //These are the analogs of Global.index0 and Global.index1 for the projected
    //face. (at the moment, I just use the old values, since I'm not doing any
    //projection yet)
    //Global.index0 = something; Global.index1 = something;

    //The last coordinate.
    Global.index2 = 3 - Global.index0 - Global.index1;

    for (let i = 0; i < _poly.length; i++) {
      poly2D.push(
        new THREE.Vector2(
          _poly[i].coordinates[Global.index0],
          _poly[i].coordinates[Global.index1]
        )
      );
    }

    const shape = new THREE.Shape(poly2D);
    //Probably won't work.
    /*
		if(hole)
			shape.holes.push(new THREE.Shape(hole));*/

    const geometry = new ShapeBufferGeometry_(shape);
    //Reorders vertices and extrudes into 3D appropriately.
    let a: number[];

    for (let i = 0; i < poly2D.length; i++) {
      a = [];
      a[Global.index0] = geometry.attributes.position.array[3 * i];
      a[Global.index1] = geometry.attributes.position.array[3 * i + 1];

      if (Global.reversePolygon)
        a[Global.index2] =
          _poly[_poly.length - i - 1].coordinates[Global.index2];
      else a[Global.index2] = _poly[i].coordinates[Global.index2];
      for (let j = 0; j < 3; j++)
        (geometry.attributes.position.array as Writeable<ArrayLike<number>>)[
          3 * i + j
        ] = a[j];
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    this.scene.add(new THREE.Mesh(geometry, this.material));
  }

  //Clears and disposes of everything in the scene, except for the lighting.
  clear(): void {
    while (this.scene.children.length > 0) {
      if (this.scene.children[0].type === "Mesh")
        (this.scene.children[0] as THREE.Mesh).geometry.dispose();

      this.scene.remove(this.scene.children[0]);
    }

    this.addLights();

    this.polytopes = [];
  }
}
