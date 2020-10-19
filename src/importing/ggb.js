"use strict";

//The part of the Polytope class for reading and writing to GGB files.

//A GGB file is really just a ZIP file in disguise.
//This ZIP file contains an XML called geogebra.xml.
//This last file contains all of the relevant info of the GGB.
//This function will be called with the XML's data as a string.
//It will store the 3D polyhedron into the global variable P.
Polytope._GGBReaderOnload = function(e) {
	var caret = new Caret(e),
  elementList = [[], [], [], []],
  vertDict = {}, //Dictionary to convert from GeoGebra point names to indices.
  edgeDict = {}, //Dictionary to convert from edges to indices.
  lst = ['<element type="point"', '<element type="point3d"', '<command name="Polygon">'],
  component,
  i, j;

  WHILELOOP:
  while(true) {
    switch(caret.skipToStringList(lst)) {
      case -1: //EOF.
        break WHILELOOP;
      case 0: //Reading a 2D point.
        //Reads the point name.
        caret.skipToString('label="');
        var lbl = caret.readUntil('"');
        vertDict[lbl] = elementList[0].length;

        //Reads the coordinates.
        caret.skipToString('<coords x="');
        var x = caret.readNumber(); caret.advance(5);
        var y = caret.readNumber(); caret.advance(5);
        var z = caret.readNumber(); caret.advance(5);
        x /= z; y /= z; z /= z;

        elementList[0].push(new Point([x, y, 0]));
        break;
      case 1: //Reading a 3D point.
        //Reads the point name.
        caret.skipToString('label="');
        var lbl = caret.readUntil('"');
        vertDict[lbl] = elementList[0].length;

        //Reads the coordinates.
        caret.skipToString('<coords x="');
        var x = caret.readNumber(); caret.advance(5);
        var y = caret.readNumber(); caret.advance(5);
        var z = caret.readNumber(); caret.advance(5);
        var w = caret.readNumber(); caret.advance(5);
        x /= w; y /= w; z /= w;

        elementList[0].push(new Point([x, y, z]));
        break;
      case 2: //Reading a polygon.
        //Reads vertex names.
        caret.skipToString('<input a0=');
        var verts = [];
        while(caret.getChar() !== '/') {
          caret.skipToChar('"'); caret.increment();
          var str = caret.readUntil('"');
          verts.push(vertDict[str]);
          caret.increment();
        }
        verts.push(verts[0]); //Simulates a cyclic order.

        //Adds edges.
        var edges = [];
        for(i = 0; i < verts.length - 1; i++) {
          //Orders the edge, so that their key (identifier) is unique.
          var edge = [verts[i], verts[i + 1]];
          if(edge[0] > edge[1]) {
            var t = edge[0];
            edge[0] = edge[1];
            edge[1] = t;
          }

          //Adds the edge to elementList if needed.
          var key = edge[0] + "_" + edge[1];
          if(edgeDict[key] === undefined) {
            edgeDict[key] = elementList[1].length;
            elementList[1].push(edge);
          }
          edges.push(edgeDict[key]);
        }

        //Adds faces.
        elementList[2].push(edges);
        break;
      }
    }

    //Gets components.
    //Graph of incidences between facets.
    var graph = [],
    facets = elementList[2];
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
        elementList[3].push(component);
    }

    P = new PolytopeC(elementList);
}
