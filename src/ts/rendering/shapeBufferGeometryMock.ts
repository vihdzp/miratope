import * as THREE from "three";
import Global from "../global";

//The reason this exists is that when a shape is defined, THREE.js sometimes
//places the vertices backwards. This is troublesome, since it means that they
//can't easily be restored.

//The only differences between this and the base ShapeBufferGeometry class are
//some extra type checking, and the
//Global.reversePolygon = !THREE.ShapeUtils.isClockWise(shapeVertices) line.

export default class ShapeBufferGeometry_ extends THREE.BufferGeometry {
  parameters: { shapes: THREE.Shape | THREE.Shape[]; curveSegments: number };

  constructor(shapes: THREE.Shape | THREE.Shape[], curveSegments = 12) {
    super();
    this.type = "ShapeBufferGeometry";

    this.parameters = {
      shapes: shapes,
      curveSegments: curveSegments,
    };

    // buffers

    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    // helper variables

    let groupStart = 0;
    let groupCount = 0;

    // allow single and array values for "shapes" parameter

    if (Array.isArray(shapes)) {
      for (let i = 0; i < shapes.length; i++) {
        addShape(shapes[i]);

        // enables MultiMaterial support
        this.addGroup(groupStart, groupCount, i);

        groupStart += groupCount;
        groupCount = 0;
      }
    } else {
      addShape(shapes);
    }

    // build geometry

    this.setIndex(indices);
    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    this.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    // helper functions

    function addShape(shape: THREE.Shape) {
      const indexOffset = vertices.length / 3;
      const points = shape.extractPoints(curveSegments);

      let shapeVertices = points.shape;
      const shapeHoles = points.holes;

      // check direction of vertices

      if (
        (Global.reversePolygon = !THREE.ShapeUtils.isClockWise(shapeVertices))
      ) {
        shapeVertices = shapeVertices.reverse();
      }

      for (let i = 0, l = shapeHoles.length; i < l; i++) {
        const shapeHole = shapeHoles[i];

        if (THREE.ShapeUtils.isClockWise(shapeHole) === true) {
          shapeHoles[i] = shapeHole.reverse();
        }
      }

      const faces = THREE.ShapeUtils.triangulateShape(
        shapeVertices,
        shapeHoles
      );

      // join vertices of inner and outer paths to a single array

      for (let i = 0, l = shapeHoles.length; i < l; i++) {
        const shapeHole = shapeHoles[i];
        shapeVertices = shapeVertices.concat(shapeHole);
      }

      // vertices, normals, uvs

      for (let i = 0, l = shapeVertices.length; i < l; i++) {
        const vertex = shapeVertices[i];

        vertices.push(vertex.x, vertex.y, 0);
        normals.push(0, 0, 1);
        uvs.push(vertex.x, vertex.y); // world uvs
      }

      // incides

      for (let i = 0, l = faces.length; i < l; i++) {
        const face = faces[i];

        const a = face[0] + indexOffset;
        const b = face[1] + indexOffset;
        const c = face[2] + indexOffset;

        indices.push(a, b, c);
        groupCount += 3;
      }
    }
  }

  toJSON(): unknown {
    const data = THREE.BufferGeometry.prototype.toJSON.call(this);

    const shapes = this.parameters.shapes;

    return toJSON(shapes, data);
  }
}

function toJSON(
  shapes: THREE.Shape | THREE.Shape[],
  data: { shapes: THREE.Shape[] }
): unknown {
  data.shapes = [];

  if (Array.isArray(shapes)) {
    for (let i = 0, l = shapes.length; i < l; i++) {
      const shape = shapes[i];

      data.shapes.push(shape["uuid"]);
    }
  } else data.shapes.push(shapes["uuid"]);

  return data;
}
