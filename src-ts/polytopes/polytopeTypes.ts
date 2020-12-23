import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import { ConstructionNode, ConstructionNodeType } from "../data structures/constructionNode";
import { GraphNode } from '../data structures/graphNode';
import { LinkedListNode } from "../data structures/linkedListNode";
import { Point } from "../geometry/point";

export type ElementList = [Point[], ...number[][][]] | [];

export enum PolytopeType {C, S};

export interface OFFOptions {
  comments?: boolean
}

interface Scene {
    scene: THREE.Scene;
    polytopes: PolytopeB[];
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;
    material: THREE.MeshLambertMaterial;
    controls: TrackballControls;
}

export abstract class PolytopeB {
  abstract construction: ConstructionNode;
  abstract dimensions: number;
  abstract spaceDimensions: number;
  abstract type: PolytopeType;
  abstract toPolytopeC(): PolytopeC;
  abstract scale(r: number): PolytopeB;
  abstract move(P: Point, mult: number): PolytopeB;

  abstract circumradius(): number;
  abstract gravicenter(): Point;

  getName(): string {
  	return this.construction.getName();
  };

  //Declared in off.ts.
  saveAsOFF(_options: OFFOptions): void {
    throw new Error("saveAsOFF called before implementation!");
  };

  //Declared in ggb.ts.
  saveAsGGB(_wireframe: boolean): void {
    throw new Error("saveAsGGB called before implementation!");
  };

  //Declared in polytopeBuild.ts.
  extrudeToPyramid(_apex: Point | number): PolytopeB {
    throw new Error("extrudeToPyramid called before implementation!");
  };

  //Declared in polytopeProducts.ts.
  extrudeToPrism(_height: number): PolytopeB {
    throw new Error("extrudeToPrism called before implementation!");
  };

  //Declared in polytopeCD.ts.
  polytopeToGraph(): GraphNode<number>[] {
    throw new Error("polytopeToGraph called before implementation!");
  };

  //Declared in render.ts.
  renderTo(_scene: Scene): void {
    throw new Error("renderTo called before implementation!");
  };
}

export class PolytopeC extends PolytopeB {
  construction: ConstructionNode;
  dimensions: number;
  spaceDimensions: number;
  type: PolytopeType;
  elementList: ElementList;

  /**
   * The constructor for the PolytopeC class.
   * @constructor
   * @param {ElementList} elementList The polytope's element list.
   * @param {ConstructionNode} constructionRoot The constructionNode representing how the polytope was built.
   * @classDesc Represents a polytope as a list of elements, in ascending order of dimensions,
   * similarly (but not identically) to an OFF file.
   * Subelements are stored as indices.
   * All points are assumed to be of the same dimension.
   * @todo Coming soon to theaters near you: A PolytopeV class!
   * PolytopeV would represent a polytope as a convex hull.
   * Or, we could make that into "another" constructor for PolytopeC.
   * We'll probably embed QHull to make that work.
   */
  constructor(elementList: ElementList, constructionRoot?: ConstructionNode) {
    super();
  	if(!constructionRoot) //The construction defaults to just the polytope itself.
    	constructionRoot = new ConstructionNode(ConstructionNodeType.Plain,
    		[
    			elementList[elementList.length - 2].length,
    			elementList.length - 1
    		]);

    this.construction = constructionRoot;
    this.dimensions = elementList.length - 1; //The rank of the polytope.
  	this.elementList = elementList;
    this.type = PolytopeType.C;

  	if(this.elementList[0])
  		this.spaceDimensions = this.elementList[0][0].dimensions();
  	else
  		this.spaceDimensions = -1; //The almighty nullitope (aka nothing)
  };

  /**
   * Scales a polytope up or down.
   * @param {number} r The scaling factor.
   * @returns {Polytope} The scaled polytope.
  */
  scale(r: number): PolytopeC {
    if(!this.elementList[0]) return this;
  	for(var i = 0; i < this.elementList[0].length; i++)
  		this.elementList[0][i].scale(r);
  	return this;
  }

  /**
   * Calculates the centroid of a polytope.
   * @returns {Point} The centroid of the polytope.
   */
  gravicenter(): Point {
    if(!this.elementList[0]) return new Point(0);

  	let d = this.spaceDimensions;
  	let res: number[] = [];

  	for(let i = 0; i < d; i++)
  		res.push(0);

  	for(let i = 0; i < this.elementList[0].length; i++)
  		for(let j = 0; j < d; j++)
  			res[j] += this.elementList[0][i].coordinates[j];

  	for(let i = 0; i < d; i++)
  		res[i] /= this.elementList[0].length;

  	return new Point(res);
  };

  circumradius(): number {
  	return this.toPolytopeC().elementList[0]![0].magnitude();
  };

  move(P: Point, mult: number): PolytopeC {
    if(!this.elementList[0]) return this;
    let Q = P.clone().scale(mult);
    for(let i = 0; i < this.elementList[0].length; i++)
      this.elementList[0][i].add(Q);
    return this;
  }

  /**
   * Makes every vertex have a set number of coordinates either by adding zeros or removing numbers.
   * @param {number} dim The new number of coordinates for each vertex.
   */
  setSpaceDimensions(dim: number): void {
    if(!this.elementList[0]) return;

  	for(let i = 0; i < this.elementList[0].length; i++) {
  		if(this.elementList[0][i].coordinates.length > dim)
  			this.elementList[0][i].coordinates = this.elementList[0][i].coordinates.slice(0, dim);
  		else if(this.elementList[0][i].coordinates.length < dim)
  			for(let j = 0; j < dim - this.elementList[0][i].coordinates.length; j++)
  				this.elementList[0][i].coordinates.push(0);
  	}
  	this.spaceDimensions = dim;
  };

  /**
   * Converts the edge representation of the i-th face to an ordered array of vertices.
   * @param {number} i The selected face.
   * @returns {number[]} An array with the indices of the vertices of the i-th face in order.
   */
  faceToVertices(i: number): number[] {
    if(!this.elementList[2] || !this.elementList[2][i])
      throw RangeError("The polytope does not have that many 2-faces!");

  	//Enumerates the vertices in order.
  	//A doubly linked list does the job easily.
  	let vertexDLL: LinkedListNode<number>[] = [];
  	for(let j = 0; j < this.elementList[2][i].length; j++) {
  		var edge = (this.elementList[1] as number[][])[this.elementList[2][i][j]];
  		if(vertexDLL[edge[0]] === undefined)
  			vertexDLL[edge[0]] = new LinkedListNode<number>(edge[0]);
  		if(vertexDLL[edge[1]] === undefined)
  			vertexDLL[edge[1]] = new LinkedListNode<number>(edge[1]);

  		vertexDLL[edge[0]].linkTo(vertexDLL[edge[1]]);
  	}

  	//Cycle of vertex indices.
  	//"this.elementList[1][this.elementList[2][i][0]][0]" is just some vertex index.
  	return vertexDLL[(this.elementList[1] as number[][])[this.elementList[2][i][0]][0]].getCycle();
  };

  /**
   * Places the gravicenter of the polytope at the origin.
   * @returns {PolytopeC} The recentered polytope.
   */
  recenter(): PolytopeC {
  	return this.move(this.gravicenter(), -1);
  };

  /**
   * Ensures that we can always correctly call toPolytopeC on a polytope.
   * @returns {PolytopeC} The polytope, unchanged.
   */
  toPolytopeC(): PolytopeC {
  	return this;
  };
}
