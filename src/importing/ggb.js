"use strict";

//The part of the Polytope class for reading and writing to GGB files.

/**
 * A GGB file is really just a ZIP file in disguise.
 * This ZIP file contains an XML called geogebra.xml.
 * This function will be called with this XML's data as a string.
 * It will store the 3D polyhedron into the global variable `P`.
 * @summary Stores the polyhedron described by an XML file
 * into the global variable `P`.
 * @private
 * @param {string} e The contents of the file.
 * @todo Load the polyhedron into a scene,
 * instead of loading it into a global variable.
 */
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
};

/**
 * Saves a polytope as a GeoGebra file.
 * Writes most of the XML manually, just editing what's needed.
 * Only supports 3D stuff for now.
 * @summary Saves a polytope as a GeoGebra file.
 * @param {boolean} wireframe Whether faces are to be omitted.
 */
Polytope.prototype.saveAsGGB = function(wireframe) {
	var P = this.toPolytopeC(),
	//ggbs often come bundled with some other files,
	//but it seems geogebra.xml is the only one that's really needed.
	ggb = new JSZip(),
	scale = 200 / this.circumradius(),
	center = this.gravicenter().coordinates,
	fourD = this.spaceDimensions > 3, //Will the GGB file be a higher-dimensional projection?
	x = 1337, y, //Positioning (arbitrary but should be decently sized).
	// Header of geogebra.xml.
	// Some settings, like the viewpoint, should probably be changed depending on the passed polytope.
	file = '<?xml version="1.0" encoding="utf-8"?><geogebra format="5.0" version="5.0.609.0" app="classic" platform="d" id="be4bb306-7dca-450f-9a95-cbe8a1c001b5"  xsi:noNamespaceSchemaLocation="http://www.geogebra.org/apps/xsd/ggb.xsd" xmlns="" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ><gui><window width="1366" height="728" /><perspectives><perspective id="tmp"><panes><pane location="" divider="0.8" orientation="1" /><pane location="0" divider="0.15" orientation="1" /></panes><views><view id="4097" visible="false" inframe="true" stylebar="true" location="1,1,1,1" size="400" window="333,109,700,550" /><view id="4" toolbar="0 || 2020 , 2021 , 2022 , 66 || 2001 , 2003 , 2002 , 2004 , 2005 || 2040 , 2041 , 2042 , 2044 , 2043" visible="false" inframe="false" stylebar="false" location="1,1" size="300" window="100,100,600,400" /><view id="2" visible="true" inframe="false" stylebar="false" location="3,3" size="250" tab="ALGEBRA" window="100,100,250,400" /><view id="8" toolbar="1001 | 1002 | 1003  || 1005 | 1004 || 1006 | 1007 | 1010 || 1008 1009 || 66 68 || 6" visible="false" inframe="false" stylebar="false" location="1,3" size="300" window="100,100,600,400" /><view id="512" toolbar="0 | 1 501 5 19 , 67 | 2 15 45 18 , 7 37 | 514 3 9 , 13 44 , 47 | 16 51 | 551 550 11 ,  20 22 21 23 , 55 56 57 , 12 | 69 | 510 511 , 512 513 | 533 531 , 534 532 , 522 523 , 537 536 , 535 , 538 | 521 520 | 36 , 38 49 560 | 571 30 29 570 31 33 | 17 | 540 40 41 42 , 27 28 35 , 6 , 502" visible="true" inframe="false" stylebar="false" location="3,1" size="926" window="100,100,600,400" /><view id="1" visible="' + fourD + '" inframe="false" stylebar="false" location="1" size="250" window="100,100,600,400" /><view id="16" visible="false" inframe="false" stylebar="false" location="1" size="150" window="50,50,500,500" /><view id="32" visible="false" inframe="false" stylebar="true" location="1" size="150" window="50,50,500,500" /><view id="64" toolbar="0" visible="false" inframe="true" stylebar="true" location="1" size="150" window="50,50,500,500" /><view id="70" toolbar="0 || 2020 || 2021 || 2022" visible="false" inframe="true" stylebar="true" location="1" size="150" window="50,50,500,500" /></views><toolbar show="true" items="0 39 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6" position="1" help="false" /><input show="true" cmd="true" top="algebra" /><dockBar show="true" east="true" /></perspective></perspectives><labelingStyle  val="0"/><font size="12"/></gui><euclidianView><viewNumber viewNo="1"/><coordSystem xZero="' + ((x - 0.4) * -50) + '" yZero="-0.3" scale="50.0" yscale="50.0"/><evSettings axes="false" grid="false" gridIsBold="false" pointCapturing="3" rightAngleStyle="1" checkboxSize="26" gridType="3"/><bgColor r="255" g="255" b="255"/><axesColor r="0" g="0" b="0"/><gridColor r="192" g="192" b="192"/><lineStyle axes="1" grid="0"/><axis id="0" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><axis id="1" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/></euclidianView><algebraView><mode val="1"/><auxiliary show="true"/></algebraView><kernel><continuous val="false"/><usePathAndRegionParameters val="true"/><decimals val="2"/><angleUnit val="degree"/><algebraStyle val="0" spreadsheet="0"/><coordStyle val="0"/></kernel><tableview min="-2.0" max="2.0" step="1.0"/><scripting blocked="false" disabled="false"/><euclidianView3D><coordSystem xZero="' + center[0] + '" yZero="' + center[1] + '" zZero="' + center[2] + '" scale="' + scale + '" xAngle="0" zAngle="0"/><evSettings axes="false" grid="false" gridIsBold="false" pointCapturing="3" rightAngleStyle="1" gridType="3"/><axis id="0" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><axis id="1" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><axis id="2" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><plate show="false"/><bgColor r="255" g="255" b="255"/><clipping use="false" show="false" size="1"/><projection type="0"/></euclidianView3D><construction title="" author="" date="">',
	edge = 0, //Index for edge names.
	//The following are provisional until Miratope does automatic coloring.
	ptColor = [96, 96, 96], //RGB color of points.
	edgeColor = [0, 0, 0], //RGB color of edges.
	faceColor = [192, 192, 192], //RGB color of faces.
	opacity = 0.5, //Opacity of faces.
	i, j, m, n, //For loop variables.
	d = P.spaceDimensions;

	//If the polytope is 4D or up:
	if(fourD) {
		//Adds text.
		//Rotation angles.
		file += '<expression label="txt1" exp="&quot;\\text{Rotation angles:}&quot;"/><element type="text" label="txt1"><show object="true" label="true" ev="40"/><objColor r="0" g="0" b="0" alpha="0.0"/><layer val="0"/><labelMode val="0"/><isLaTeX val="true"/><font serif="true" sizeM="1.0" size="0" style="0"/><startPoint x="' + (x - 0.3) + '" y="-0.2" z="1.0"/></element>';
		//Projection point.
		//y = d * (d - 1) / 2;
		//file += '<expression label="txt2" exp="&quot;\\text{Projection point:}&quot;"/><element type="text" label="txt2"><show object="true" label="true" ev="40"/><objColor r="0" g="0" b="0" alpha="0.0"/><layer val="0"/><labelMode val="0"/><isLaTeX val="true"/><font serif="true" sizeM="1.0" size="0" style="0"/><startPoint x="' + (x - 0.3) + '" y="' + (-y - 1.2) + '" z="1.0"/></element>';

		//Adds rotation sliders.
		y = -1.3;
		for(i = 0; i < d; i++)
			for(j = i + 1; j < d; j++) {
				file += '<element type="numeric" label="α_{' + i + ',' + j + '}"><value val="0"/><show object="true" label="true"/><objColor r="0" g="0" b="0" alpha="0.1"/><layer val="0"/><labelMode val="1"/><slider min="0" max="(2 * π)" width="4.0" x="' + x + '" y="' + y + '" fixed="false" horizontal="true" showAlgebra="true"/><lineStyle thickness="10" type="0" typeHidden="1"/><animation step="0.01" speed="1" type="0" playing="false"/><ggbscript onUpdate=""/></element>';
				y--;
			}

		/*
		//Adds projection point sliders.
		y--;
		for(i = 0; i < d - 1; i++) {
			file += '<element type="numeric" label="x_{' + i + '}"><value val="0"/><show object="true" label="true"/><objColor r="0" g="0" b="0" alpha="0.1"/><layer val="0"/><labelMode val="1"/><slider min="-10" max="10" width="4.0" x="0" y="' + y + '" fixed="false" horizontal="true" showAlgebra="true"/><lineStyle thickness="10" type="0" typeHidden="1"/><animation step="0.01" speed="1" type="0" playing="false"/><ggbscript onUpdate=""/></element>';
			y--;
		}
		file += '<element type="numeric" label="x_{' + i + '}"><value val="' + 5 +  '"/><show object="true" label="true"/><objColor r="0" g="0" b="0" alpha="0.1"/><layer val="0"/><labelMode val="1"/><slider min="-10" max="10" width="4.0" x="0" y="' + y + '" fixed="false" horizontal="true" showAlgebra="true"/><lineStyle thickness="10" type="0" typeHidden="1"/><animation step="0.01" speed="1" type="0" playing="false"/><ggbscript onUpdate=""/></element>';

		//Adds projection point.
		file += '<expression label="P" exp="{';
		for(i = 0; i < d - 1; i++)
			file += 'x_{' + i + '},';
		file += 'x_{' + i + '}}" /><element type="list" label="P"><objColor r="0" g="100" b="0" alpha="0.1"/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';
		*/

		//ADD I
		file += '<expression label="I" exp="{{1,0,0},{0,1,0},{0,0,1}';
		for(i = 3; i < d; i++)
			file += ',{0,0,0}';
		file += '}"/><element type="list" label="I"><objColor r="0" g="100" b="0" alpha="0.1"/><animation step="0.1" speed="1" type="0" playing="false"/><ggbscript val=""/><ggbscript onUpdate=""/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';

		//ADD M
		file += '<expression label="M" exp="';
		for(i = 0; i < d - 1; i++)
			for(j = i + 1; j < d; j++) {
				file += '{';
				for(m = 0; m < d; m++) {
					file += '{';
					for(n = 0; n < d; n++) {
						if(m == i && n == i)
							file += 'cos(α_{' + i + ',' + j + '})'
						else if(m === i && n === j)
							file += '-sin(α_{' + i + ',' + j + '})'
						else if(m === j && n === i)
							file += 'sin(α_{' + i + ',' + j + '})'
						else if(m === j && n === j)
							file += 'cos(α_{' + i + ',' + j + '})'
						else if(m === n)
							file += '1';
						else
							file += '0';

						if(n === d - 1)
							file += '}';
						else
							file += ',';
					}

					if(m === d - 1)
						file += '}';
					else
						file += ',';
				}

				if(i !== d - 2 || j !== d - 1)
					file += '*';
			}

		file += '"/><element type="list" label="M"><objColor r="0" g="100" b="0" alpha="0.1"/><animation step="0.1" speed="1" type="0" playing="false"/><ggbscript val=""/><ggbscript onUpdate=""/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';

		//Adds real vertices.
		for(i = 0; i < P.elementList[0].length; i++) {
			var coordList = '{';
			//The coordinates need to be in uppercase, since for example 1e+10 = 2.718281+10 by GeoGebra's standards.
			for(j = 0; j < d - 1; j++)
				coordList += String(P.elementList[0][i].coordinates[j]).toUpperCase() + ',';
			coordList += String(P.elementList[0][i].coordinates[j]).toUpperCase() + '}';

			file += '<expression label="P_{' + i + '}\'" exp="' + coordList + '"/><element type="list" label="P_{' + i + '}\'"><objColor r="0" g="100" b="0" alpha="0.10000000149011612"/><animation step="0.1" speed="1" type="0" playing="false"/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';
		}

		//Adds vertices.
		for(i = 0; i < P.elementList[0].length; i++) {
			var coords = P.elementList[0][i].coordinates;
			file += '<command name="Point"><input a0="({P_{' + i + '}\'}*M*I)"/><output a0="P_{' + i + '}"/></command><element type="point3d" label="P_{' + i + '}"><show object="true" label="false" ev="4"/><objColor r="' + ptColor[0] + '" g="' + ptColor[1] + '" b="' + ptColor[2] + '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><coords x="0" y="0" z="0" w="1.0"/><pointSize val="5"/></element>';
		}
	}

	//Polyhedron:
	else{
		//Adds vertices.
		for(i = 0; i < P.elementList[0].length; i++) {
			var coords = P.elementList[0][i].coordinates;
			//The coordinates need to be in uppercase, since for example 1e+10 = 2.718281+10 by GeoGebra's standards.
			file += '<element type="point3d" label="P_{' + i + '}"><show object="true" label="false" ev="4"/><objColor r="' + ptColor[0] + '" g="' + ptColor[1] + '" b="' + ptColor[2] + '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><animation step="0.1" speed="1" type="1" playing="false"/><coords x="' + String(coords[0]).toUpperCase() + '" y="' + String(coords[1]).toUpperCase() + '" z="' + String(coords[2]).toUpperCase() + '" w="1.0"/><pointSize val="5"/></element>';
		}
	}

	if(wireframe) {
		//Adds edges.
		for(i = 0; i < P.elementList[1].length; i++)
			file += '<command name="Segment"><input a0="P_{' + P.elementList[1][i][0] + '}" a1="P_{' + P.elementList[1][i][1] + '}"/><output a0="e_{' + edge + '}"/></command><element type="segment3d" label="e_{' + (edge++) + '}"><show object="true" label="false" ev="4"/><objColor r="' + edgeColor[0] + '" g="' + edgeColor[1] + '" b="' + edgeColor[2] + '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><lineStyle thickness="2" type="0" typeHidden="1"/><outlyingIntersections val="false"/><keepTypeOnTransform val="true"/></element>';
	}
	else {
		//Adds faces.
		for(i = 0; i < P.elementList[2].length; i++) {
			//Specifies vertices of face.
			file += '<command name="Polygon"><input ';
			var verts = P.faceToVertices(i);
			for(j = 0; j < verts.length; j++)
				file += 'a' + j + '="P_{' + verts[j] + '}" ';
			file += '/><output a0="f_{' + i + '}" ';

			//Names the faces' edges.
			for(j = 0; j < verts.length; j++)
				file += 'a' + (j + 1) + '="e_{' + (edge++) + '}" ';

			//Adds the face.
			file += '/></command><element type="polygon3d" label="f_{' + i + '}"><lineStyle thickness="5" type="0" typeHidden="1" opacity="178"/><show object="true" label="false" ev="4"/><objColor r="' + faceColor[0] + '" g="' + faceColor[1] + '" b="' + faceColor[2] + '" alpha="' + opacity + '"/><layer val="0"/><labelMode val="0"/></element>';

			//Edges... again.
			edge -= verts.length;
			for(j = 0; j < verts.length; j++)
				file += '<element type="segment3d" label="e_{' + (edge++) + '}"><show object="true" label="false" ev="4"/><objColor r="' + edgeColor[0] + '" g="' + edgeColor[1] + '" b="' + edgeColor[2] + '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><auxiliary val="false"/><lineStyle thickness="2" type="0" typeHidden="1"/><outlyingIntersections val="false"/><keepTypeOnTransform val="true"/></element>';
		}
	}

	//Closing tags.
	file += '</construction></geogebra>';
	Polytope.fileName = Translation.firstToUpper(P.getName()) + ".ggb";

	//Save file.
	ggb.file("geogebra.xml", file);
	ggb.generateAsync({type:"blob"}).then(Polytope._saveBlob);
};
