/**
 * Contains various methods to load and save files, particularly those to load
 * the polytope library.
 *
 * @packageDocumentation
 * @module Library
 * @category File
 */

import * as JSZip from "jszip";

import { Name as CNName } from "../Data structures/Construction/Node";
import { GraphNode } from "../Data structures/graphs";
import Point from "../geometry/Point";
import * as Build from "../polytopes/classes/Build";
import { ElementList, PolytopeC } from "../polytopes/types";
import * as Message from "../Translation/Basic/Message";
import { Language } from "../Translation/Language";
import Caret from "./Caret";

/** A filename, used as a temporary variable in some functions. */
export let fileName: string;

export const setFileName = function (newFileName: string): void {
  fileName = newFileName;
};

/**
 * Helper function for [[`openFile`]] and more specifically for
 * [[`onloadOFF`]]. Checks whether two arrays have a common element using a
 * dictionary.
 *
 * @param a The first array to check.
 * @param b The second array to check.
 * @returns Whether the arrays have a common element or not.
 */
const checkCommonElements = function (a: number[], b: number[]): boolean {
  const vals: boolean[] = [];
  vals[a[0]] = true;

  let i: number;
  for (i = 1; i < a.length; i++) {
    if (vals[a[i]]) return true;
    vals[a[i]] = true;
  }

  for (i = 0; i < b.length - 1; i++) {
    if (vals[b[i]]) return true;
    vals[b[i]] = true;
  }

  return !!vals[b[i]];
};

// Saves the file with the given data, the given MIME type,
// and the given extension.
export const saveBlob = function (blob: Blob): void {
  const newFileName = fileName.replace("/", "_");

  if (navigator.msSaveOrOpenBlob) navigator.msSaveOrOpenBlob(blob, newFileName);
  else {
    const a: HTMLAnchorElement = document.getElementById(
      "download"
    ) as HTMLAnchorElement;
    a.href = URL.createObjectURL(blob);
    a.download = newFileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

/**
 * Opens a file and stores it into the global variable `P`.
 *
 * @param e Either the event triggered by the import button,
 * or a local filepath.
 * @todo Replace P by `scene.polytope` or something similar.
 * @todo Add support for more file formats (like STL or OBJ).
 * @todo Rewrite the code with npm's fs.
 */
export const openFile = function (e: Event | string): void {
  // If e is an event.
  if (e instanceof Event) {
    const files = (<HTMLInputElement>e.target).files;
    if (!files) return;
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();

    // File name of imported polytope.
    let name = file.name;

    // Extracts the filename and extension.
    const i = name.lastIndexOf(".");
    // Extension of file.
    const ext = name.substr(i + 1);

    // Removes extension from file name.
    name = name.substr(0, i);
    if (Language.code !== "de") name = Message.firstToLower(name); // Lowercase name.

    // Stored in a global variable
    // so it can be accessed from PolytopeB._readerOnload.
    fileName = name;

    // Handles the file according to its extension.
    switch (ext) {
      case "off":
        reader.onload = function (ev: ProgressEvent<FileReader>) {
          onloadOFF((ev.target as FileReader).result as string);
        };
        reader.readAsText(file);
        break;
      case "ggb":
        reader.onload = function (ev: ProgressEvent<FileReader>) {
          if (ev.target && ev.target.result) {
            JSZip.loadAsync(ev.target.result).then(function (zip: JSZip) {
              const xml = zip.file("geogebra.xml");
              if (xml) xml.async("string").then(onloadGGB);
              else throw new Error("Invalid GeoGebra file!");
            });
          }
        };
        reader.readAsArrayBuffer(file);
        break;
    }
  }

  // If e is a string.
  else {
    fileName = e;

    // Extracts the filename and extension.
    const i = fileName.lastIndexOf(".");
    // const ext = Library.fileName.substr(i + 1); //Extension of file.

    // Removes extension from file name.
    fileName = fileName.substr(0, i);

    // Lowercase name.
    if (!Language.nounCapitalization) fileName = Message.firstToLower(fileName);

    // Reads the file as an OFF file.
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      // this.status === 0 is for debug purposes only!
      if (this.readyState === 4 && this.status === 200) {
        onloadOFF(this.responseText);
      }
    };

    xhttp.open("GET", e, true);
    xhttp.send();
  }
};

/**
 * A GGB file is really just a ZIP file in disguise.
 * This ZIP file contains an XML called geogebra.xml.
 * This function will be called with this XML's data as a string.
 * It will store the 3D polyhedron into the global variable `P`.
 *
 * @param contents The contents of the file.
 * @todo Load the polyhedron into a scene,
 * instead of loading it into a global variable.
 */
const onloadGGB = function (contents: string): void {
  const caret = new Caret(contents);
  const elementList: ElementList = [[], [], [], []];

  // Dictionary to convert from GeoGebra point names to indices.
  const vertDict: { [key: string]: number } = {};

  // Dictionary to convert from edges to indices.
  const edgeDict: { [key: number]: number } = {};

  // The tags we're reading from the file.
  const tagList = [
    '<element type="point"',
    '<element type="point3d"',
    '<command name="Polygon">',
  ];

  let nextStringIndex: number;

  while ((nextStringIndex = caret.skipToStringList(tagList)) != -1) {
    switch (nextStringIndex) {
      case 0: {
        // Reading a 2D point.

        // Reads the point name.
        caret.skipToString('label="');
        vertDict[caret.readUntil('"')] = elementList[0].length;

        // Reads the coordinates.
        caret.skipToString('<coords x="');

        let x = caret.readNumber();
        caret.advance(5);

        let y = caret.readNumber();
        caret.advance(5);

        let z = caret.readNumber();
        caret.advance(5);

        x /= z;
        y /= z;
        z /= z;

        elementList[0].push(new Point([x, y, 0]));
        break;
      }
      case 1: {
        // Reading a 3D point.

        // Reads the point name.
        caret.skipToString('label="');
        vertDict[caret.readUntil('"')] = elementList[0].length;

        // Reads the coordinates.
        caret.skipToString('<coords x="');

        let x = caret.readNumber();
        caret.advance(5);

        let y = caret.readNumber();
        caret.advance(5);

        let z = caret.readNumber();
        caret.advance(5);

        const w = caret.readNumber();
        caret.advance(5);

        x /= w;
        y /= w;
        z /= w;

        elementList[0].push(new Point([x, y, z]));
        break;
      }
      // Reading a polygon.
      case 2: {
        // Reads vertex names.
        caret.skipToString("<input a0=");
        const verts: number[] = [];
        while (caret.getChar() !== "/") {
          caret.skipToChar('"');
          caret.increment();
          const str = caret.readUntil('"');
          verts.push(vertDict[str]);
          caret.increment();
        }
        // Simulates a cyclic order.
        verts.push(verts[0]);

        // Adds edges.
        const edges: number[] = [];
        for (let i = 0; i < verts.length - 1; i++) {
          // Orders the edge, so that their key (identifier) is unique.
          const edge: [number, number] = [verts[i], verts[i + 1]];
          if (edge[0] > edge[1]) {
            const t = edge[0];
            edge[0] = edge[1];
            edge[1] = t;
          }

          // Adds the edge to elementList if needed.
          const key: string = edge[0] + "_" + edge[1];
          if (edgeDict[key] === undefined) {
            edgeDict[key] = elementList[1].length;
            elementList[1].push(edge);
          }

          edges.push(edgeDict[key]);
        }

        // Adds faces.
        elementList[2].push(edges);
        break;
      }
    }
  }

  // Gets components.
  // Graph of incidences between facets.
  const graph: GraphNode<number>[] = [];
  const facets = elementList[2];

  for (let i = 0; i < facets.length; i++) graph.push(new GraphNode(i));

  // Calculates incidences.
  for (let i = 0; i < facets.length; i++) {
    for (let j = i + 1; j < facets.length; j++) {
      if (checkCommonElements(facets[i], facets[j])) graph[i].linkTo(graph[j]);
    }
  }

  // Gets components.
  for (let i = 0; i < facets.length; i++) {
    const component = graph[i].getComponent();
    if (component) elementList[3].push(component.values());
  }

  globalThis.P = new PolytopeC(elementList);
};

/**
 * Helper function for [[`openFile`]].
 * Is called when an OFF file is loaded.
 *
 * @param contents The contents of the file.
 */
const onloadOFF = function (contents: string): void {
  // Caret for reading the OFF file.
  const caret = new Caret(contents);

  // The number of dimensions of the OFF file's polytope.
  let dimensions = caret.readNumber();

  // A dictionary mapping hashes of pairs of integers to edge indices.
  const edgeList: number[] = [];

  // The amount of vertices, edges, faces...
  // elementCount[1] goes unused except for the special case of 2D components.
  const elementCount: number[] = [];

  // The elements of the described polytope.
  const elementList: ElementList = [[]];

  // The file just starts with OFF.
  if (isNaN(dimensions)) dimensions = 3;

  // Checks that the word OFF is the next thing on the file.
  if (caret.readWord() !== "OFF") caret.throwError("invalidFile");

  // Nullitope
  if (dimensions === -1) {
    globalThis.P = Build.nullitope();
    return;
  }

  // Point
  if (dimensions === 0) {
    globalThis.P = Build.point();
    return;
  }

  // Reads vertex amount.
  if (dimensions >= 1) {
    elementCount.push(caret.readNumber());
    elementList.push([]);
  }

  // Reads face and edge amounts.
  if (dimensions >= 3) {
    elementCount.push(0, caret.readNumber());
    // We *can't* actually care about the edge amount,
    // since Stella itself ignores it, and it's often set to 0.
    caret.readWord();
    elementList.push([], []);
  }

  // Reads component amount in the special 2OFF case.
  else if (dimensions === 2) {
    elementCount.push(0, caret.readNumber());
    elementList.push([]);
  }

  // Reads higher element amounts.
  for (let i = 3; i < dimensions; i++) {
    elementCount.push(caret.readNumber());
    elementList.push([]);
  }

  // Adds vertices.
  for (let i = 0; i < elementCount[0]; i++) {
    const coords: number[] = [];
    for (let j = 0; j < dimensions; j++) coords.push(caret.readNumber());
    elementList[0].push(new Point(coords));
  }

  if (dimensions >= 2) {
    // Adds faces and edges (or compounds in the special case).
    for (let i = 0; i < elementCount[2]; i++) {
      const indices: number[] = [];
      const face: number[] = [];
      const elCount = caret.readNumber();

      // Retrieves vertices.
      for (let j = 0; j < elCount; j++) indices.push(caret.readNumber());

      // Creates edges.
      for (let j = 0; j < elCount - 1; j++) {
        // Orders the edge's vertices.
        let x = indices[j];
        let y = indices[j + 1];
        if (x < y) {
          const t = x;
          x = y;
          y = t;
        }
        const t = ((x + y + 1) * (x + y)) / 2 + y; // Cantor pairing function.
        if (edgeList[t] === undefined) {
          edgeList[t] = elementList[1].length;
          elementList[1].push([x, y]);
        }
        face.push(edgeList[t]);
      }
      // Last edge.
      let x = indices[0];
      let y = indices[indices.length - 1];
      if (x < y) {
        const t = x;
        x = y;
        y = t;
      }
      const t = ((x + y + 1) * (x + y)) / 2 + y; // Cantor pairing function.
      if (edgeList[t] === undefined) {
        edgeList[t] = elementList[1].length;
        elementList[1].push([x, y]);
      }
      face.push(edgeList[t]);

      elementList[2].push(face);
    }
  }

  // Adds higher-dimensional elements.
  for (let i = 3; i < dimensions; i++) {
    for (let j = 0; j < elementCount[i]; j++) {
      const indices: number[] = [];
      const elCount = caret.readNumber();
      for (let t = 0; t < elCount; t++) indices.push(caret.readNumber());
      (elementList[i] as number[][]).push(indices);
    }
  }

  // Gets components. The 1D case is trivial.
  if (dimensions === 1) {
    elementList[1].push([]);
    for (let i = 0; i < elementCount[0]; i++) elementList[1][0].push(i);
  }

  // Gets components in higher dimensions, except in 2D,
  // where they've already been retrieved.
  else if (dimensions >= 3) {
    // Graph of incidences between facets.
    const graph: GraphNode<number>[] = [];
    const facets: number[][] = elementList[dimensions - 1] as number[][];
    for (let i = 0; i < facets.length; i++) graph.push(new GraphNode(i));

    // Calculates incidences.
    for (let i = 0; i < facets.length; i++) {
      for (let j = i + 1; j < facets.length; j++) {
        if (checkCommonElements(facets[i], facets[j])) {
          graph[i].linkTo(graph[j]);
        }
      }
    }

    // Gets components.
    for (let i = 0; i < facets.length; i++) {
      const component = graph[i].getComponent();

      if (component) {
        (elementList[elementList.length - 1] as number[][]).push(
          component.values()
        );
      }
    }
  }

  globalThis.P = new PolytopeC(elementList, new CNName(fileName));
};
