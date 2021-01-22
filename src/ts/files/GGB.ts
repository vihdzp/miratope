import * as JSZip from "jszip";
import Point from "../geometry/Point";
import { PolytopeB } from "../polytopes/types";
import { Translation } from "../translation/Translation";
import Library from "./Library";

export interface GGBOptions {
  wireframe: boolean;
}

/**
 * Saves a polytope as a GeoGebra file.
 * Writes most of the XML manually, just editing what's needed.
 *
 * @param wireframe Whether faces are to be omitted.
 * @todo Compress the file XML a bit?
 * @todo Add a "Made in Miratope v. ###" tag to the Geogebra file.
 * @todo Deal with the nullitope case.
 */
export const saveAsGGB = function (
  polytope: PolytopeB,
  options: GGBOptions
): void {
  const P = polytope.toPolytopeC();

  //We can deal with the nullitope later.
  if (!P.elementList[0]) return;

  //ggbs often come bundled with some other files,
  //but it seems geogebra.xml is the only one that's really needed.
  const ggb = new JSZip();
  const scale = 200 / P.circumradius();
  const center = (P.gravicenter() as Point).coordinates;
  const d = P.spaceDimensions;
  const fourD = d >= 4; //Will the GGB file be a higher-dimensional projection?
  const x = 1337; //Positioning (arbitrary but should be decently sized).
  // Header of geogebra.xml.
  // Some settings, like the viewpoint, should probably be changed
  //depending on the passed polytope.
  let file =
    '<?xml version="1.0" encoding="utf-8"?><geogebra format="5.0" version="5.0.609.0" app="classic" platform="d" id="be4bb306-7dca-450f-9a95-cbe8a1c001b5"	xsi:noNamespaceSchemaLocation="http://www.geogebra.org/apps/xsd/ggb.xsd" xmlns="" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ><gui><globalThis width="1366" height="728" /><perspectives><perspective id="tmp"><panes><pane location="" divider="0.8" orientation="1" /><pane location="0" divider="0.15" orientation="1" /></panes><views><view id="4097" visible="false" inframe="true" stylebar="true" location="1,1,1,1" size="400" globalThis="333,109,700,550" /><view id="4" toolbar="0 || 2020 , 2021 , 2022 , 66 || 2001 , 2003 , 2002 , 2004 , 2005 || 2040 , 2041 , 2042 , 2044 , 2043" visible="false" inframe="false" stylebar="false" location="1,1" size="300" globalThis="100,100,600,400" /><view id="2" visible="true" inframe="false" stylebar="false" location="3,3" size="250" tab="ALGEBRA" globalThis="100,100,250,400" /><view id="8" toolbar="1001 | 1002 | 1003	|| 1005 | 1004 || 1006 | 1007 | 1010 || 1008 1009 || 66 68 || 6" visible="false" inframe="false" stylebar="false" location="1,3" size="300" globalThis="100,100,600,400" /><view id="512" toolbar="0 | 1 501 5 19 , 67 | 2 15 45 18 , 7 37 | 514 3 9 , 13 44 , 47 | 16 51 | 551 550 11 ,	20 22 21 23 , 55 56 57 , 12 | 69 | 510 511 , 512 513 | 533 531 , 534 532 , 522 523 , 537 536 , 535 , 538 | 521 520 | 36 , 38 49 560 | 571 30 29 570 31 33 | 17 | 540 40 41 42 , 27 28 35 , 6 , 502" visible="true" inframe="false" stylebar="false" location="3,1" size="926" globalThis="100,100,600,400" /><view id="1" visible="' +
    fourD +
    '" inframe="false" stylebar="false" location="1" size="250" globalThis="100,100,600,400" /><view id="16" visible="false" inframe="false" stylebar="false" location="1" size="150" globalThis="50,50,500,500" /><view id="32" visible="false" inframe="false" stylebar="true" location="1" size="150" globalThis="50,50,500,500" /><view id="64" toolbar="0" visible="false" inframe="true" stylebar="true" location="1" size="150" globalThis="50,50,500,500" /><view id="70" toolbar="0 || 2020 || 2021 || 2022" visible="false" inframe="true" stylebar="true" location="1" size="150" globalThis="50,50,500,500" /></views><toolbar show="true" items="0 39 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24	20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49	50 , 71	14	68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6" position="1" help="false" /><input show="true" cmd="true" top="algebra" /><dockBar show="true" east="true" /></perspective></perspectives><labelingStyle	val="0"/><font size="12"/></gui><euclidianView><viewNumber viewNo="1"/><coordSystem xZero="' +
    (x - 0.4) * -50 +
    '" yZero="-0.3" scale="50.0" yscale="50.0"/><evSettings axes="false" grid="false" gridIsBold="false" pointCapturing="3" rightAngleStyle="1" checkboxSize="26" gridType="3"/><bgColor r="255" g="255" b="255"/><axesColor r="0" g="0" b="0"/><gridColor r="192" g="192" b="192"/><lineStyle axes="1" grid="0"/><axis id="0" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><axis id="1" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/></euclidianView><algebraView><mode val="1"/><auxiliary show="true"/></algebraView><kernel><continuous val="false"/><usePathAndRegionParameters val="true"/><decimals val="2"/><angleUnit val="degree"/><algebraStyle val="0" spreadsheet="0"/><coordStyle val="0"/></kernel><tableview min="-2.0" max="2.0" step="1.0"/><scripting blocked="false" disabled="false"/><euclidianView3D><coordSystem xZero="' +
    center[0] +
    '" yZero="' +
    center[1] +
    '" zZero="' +
    center[2] +
    '" scale="' +
    scale +
    '" xAngle="0" zAngle="0"/><evSettings axes="false" grid="false" gridIsBold="false" pointCapturing="3" rightAngleStyle="1" gridType="3"/><axis id="0" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><axis id="1" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><axis id="2" show="false" label="" unitLabel="" tickStyle="1" showNumbers="true"/><plate show="false"/><bgColor r="255" g="255" b="255"/><clipping use="false" show="false" size="1"/><projection type="0"/></euclidianView3D><construction title="" author="" date="">';
  let edge = 0; //Index for edge names.
  //The following are provisional until Miratope does automatic coloring.
  const ptColor: [number, number, number] = [96, 96, 96], //RGB color of points.
    edgeColor: [number, number, number] = [0, 0, 0], //RGB color of edges.
    faceColor: [number, number, number] = [192, 192, 192]; //RGB color of faces.
  const opacity = 0.5; //Opacity of faces.

  //If the polytope is 4D or up:
  if (fourD) {
    //Adds text.
    //Rotation angles.
    file +=
      '<expression label="txt1" exp="&quot;\\text{Rotation angles:}&quot;"/><element type="text" label="txt1"><show object="true" label="true" ev="40"/><objColor r="0" g="0" b="0" alpha="0.0"/><layer val="0"/><labelMode val="0"/><isLaTeX val="true"/><font serif="true" sizeM="1.0" size="0" style="0"/><startPoint x="' +
      (x - 0.3) +
      '" y="-0.2" z="1.0"/></element>';
    //Projection point.
    //y = d * (d - 1) / 2;
    //file += '<expression label="txt2" exp="&quot;\\text{Projection point:}&quot;"/><element type="text" label="txt2"><show object="true" label="true" ev="40"/><objColor r="0" g="0" b="0" alpha="0.0"/><layer val="0"/><labelMode val="0"/><isLaTeX val="true"/><font serif="true" sizeM="1.0" size="0" style="0"/><startPoint x="' + (x - 0.3) + '" y="' + (-y - 1.2) + '" z="1.0"/></element>';

    //Adds rotation sliders.
    let y = -1.3;
    for (let i = 0; i < d; i++)
      for (let j = i + 1; j < d; j++) {
        file +=
          '<element type="numeric" label="α_{' +
          i +
          "," +
          j +
          '}"><value val="0"/><show object="true" label="true"/><objColor r="0" g="0" b="0" alpha="0.1"/><layer val="0"/><labelMode val="1"/><slider min="0" max="(2 * π)" width="4.0" x="' +
          x +
          '" y="' +
          y +
          '" fixed="false" horizontal="true" showAlgebra="true"/><lineStyle thickness="10" type="0" typeHidden="1"/><animation step="0.01" speed="1" type="0" playing="false"/><ggbscript onUpdate=""/></element>';
        y--;
      }

    /*
		//Adds projection point sliders.
		y--;
		for(i = 0; i < d - 1; i++) {
			file += '<element type="numeric" label="x_{' + i + '}"><value val="0"/><show object="true" label="true"/><objColor r="0" g="0" b="0" alpha="0.1"/><layer val="0"/><labelMode val="1"/><slider min="-10" max="10" width="4.0" x="0" y="' + y + '" fixed="false" horizontal="true" showAlgebra="true"/><lineStyle thickness="10" type="0" typeHidden="1"/><animation step="0.01" speed="1" type="0" playing="false"/><ggbscript onUpdate=""/></element>';
			y--;
		}
		file += '<element type="numeric" label="x_{' + i + '}"><value val="' + 5 +	'"/><show object="true" label="true"/><objColor r="0" g="0" b="0" alpha="0.1"/><layer val="0"/><labelMode val="1"/><slider min="-10" max="10" width="4.0" x="0" y="' + y + '" fixed="false" horizontal="true" showAlgebra="true"/><lineStyle thickness="10" type="0" typeHidden="1"/><animation step="0.01" speed="1" type="0" playing="false"/><ggbscript onUpdate=""/></element>';

		//Adds projection point.
		file += '<expression label="P" exp="{';
		for(i = 0; i < d - 1; i++)
			file += 'x_{' + i + '},';
		file += 'x_{' + i + '}}" /><element type="list" label="P"><objColor r="0" g="100" b="0" alpha="0.1"/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';
		*/

    //ADD I
    file += '<expression label="I" exp="{{1,0,0},{0,1,0},{0,0,1}';
    for (let i = 3; i < d; i++) file += ",{0,0,0}";
    file +=
      '}"/><element type="list" label="I"><objColor r="0" g="100" b="0" alpha="0.1"/><animation step="0.1" speed="1" type="0" playing="false"/><ggbscript val=""/><ggbscript onUpdate=""/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';

    //ADD M
    file += '<expression label="M" exp="';
    for (let i = 0; i < d - 1; i++)
      for (let j = i + 1; j < d; j++) {
        file += "{";
        for (let m = 0; m < d; m++) {
          file += "{";
          for (let n = 0; n < d; n++) {
            if (m === i && n === i) file += "cos(α_{" + i + "," + j + "})";
            else if (m === i && n === j)
              file += "-sin(α_{" + i + "," + j + "})";
            else if (m === j && n === i) file += "sin(α_{" + i + "," + j + "})";
            else if (m === j && n === j) file += "cos(α_{" + i + "," + j + "})";
            else if (m === n) file += "1";
            else file += "0";

            if (n === d - 1) file += "}";
            else file += ",";
          }

          if (m === d - 1) file += "}";
          else file += ",";
        }

        if (i !== d - 2 || j !== d - 1) file += "*";
      }

    file +=
      '"/><element type="list" label="M"><objColor r="0" g="100" b="0" alpha="0.1"/><animation step="0.1" speed="1" type="0" playing="false"/><ggbscript val=""/><ggbscript onUpdate=""/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';

    //Adds real vertices.
    for (let i = 0; i < P.elementList[0].length; i++) {
      let coordList = "{";
      //The coordinates need to be in uppercase,
      //since for example 1e+10 = 2.718281+10 by GeoGebra's standards.
      let j: number;
      for (j = 0; j < d - 1; j++)
        coordList +=
          String(P.elementList[0][i].coordinates[j]).toUpperCase() + ",";
      coordList +=
        String(P.elementList[0][i].coordinates[j]).toUpperCase() + "}";

      file +=
        '<expression label="P_{' +
        i +
        '}\'" exp="' +
        coordList +
        '"/><element type="list" label="P_{' +
        i +
        '}\'"><objColor r="0" g="100" b="0" alpha="0.10000000149011612"/><animation step="0.1" speed="1" type="0" playing="false"/><lineStyle thickness="5" type="0" typeHidden="1"/><pointSize val="5"/><angleStyle val="0"/><symbolic val="true" /></element>';
    }

    //Adds vertices.
    for (let i = 0; i < P.elementList[0].length; i++)
      file +=
        '<command name="Point"><input a0="({P_{' +
        i +
        '}\'}*M*I)"/><output a0="P_{' +
        i +
        '}"/></command><element type="point3d" label="P_{' +
        i +
        '}"><show object="true" label="false" ev="4"/><objColor r="' +
        ptColor[0] +
        '" g="' +
        ptColor[1] +
        '" b="' +
        ptColor[2] +
        '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><coords x="0" y="0" z="0" w="1.0"/><pointSize val="5"/></element>';
  }

  //Polyhedron:
  else {
    //Adds vertices.
    for (let i = 0; i < P.elementList[0].length; i++) {
      const coords = P.elementList[0][i].coordinates;
      //The coordinates need to be in uppercase,
      //since for example 1e+10 = 2.718281+10 by GeoGebra's standards.
      file +=
        '<element type="point3d" label="P_{' +
        i +
        '}"><show object="true" label="false" ev="4"/><objColor r="' +
        ptColor[0] +
        '" g="' +
        ptColor[1] +
        '" b="' +
        ptColor[2] +
        '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><animation step="0.1" speed="1" type="1" playing="false"/><coords x="' +
        String(coords[0]).toUpperCase() +
        '" y="' +
        String(coords[1]).toUpperCase() +
        '" z="' +
        String(coords[2]).toUpperCase() +
        '" w="1.0"/><pointSize val="5"/></element>';
    }
  }

  if (options.wireframe && P.elementList[1]) {
    //Adds edges.
    for (let i = 0; i < P.elementList[1].length; i++)
      file +=
        '<command name="Segment"><input a0="P_{' +
        P.elementList[1][i][0] +
        '}" a1="P_{' +
        P.elementList[1][i][1] +
        '}"/><output a0="e_{' +
        edge +
        '}"/></command><element type="segment3d" label="e_{' +
        edge++ +
        '}"><show object="true" label="false" ev="4"/><objColor r="' +
        edgeColor[0] +
        '" g="' +
        edgeColor[1] +
        '" b="' +
        edgeColor[2] +
        '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><lineStyle thickness="2" type="0" typeHidden="1"/><outlyingIntersections val="false"/><keepTypeOnTransform val="true"/></element>';
  } else if (P.elementList[2]) {
    //Adds faces.
    for (let i = 0; i < P.elementList[2].length; i++) {
      //Specifies vertices of face.
      file += '<command name="Polygon"><input ';
      const verts = P.faceToVertices(i);
      for (let j = 0; j < verts.length; j++)
        file += "a" + j + '="P_{' + verts[j] + '}" ';
      file += '/><output a0="f_{' + i + '}" ';

      //Names the faces' edges.
      for (let j = 0; j < verts.length; j++)
        file += "a" + (j + 1) + '="e_{' + edge++ + '}" ';

      //Adds the face.
      file +=
        '/></command><element type="polygon3d" label="f_{' +
        i +
        '}"><lineStyle thickness="5" type="0" typeHidden="1" opacity="178"/><show object="true" label="false" ev="4"/><objColor r="' +
        faceColor[0] +
        '" g="' +
        faceColor[1] +
        '" b="' +
        faceColor[2] +
        '" alpha="' +
        opacity +
        '"/><layer val="0"/><labelMode val="0"/></element>';

      //Edges... again.
      edge -= verts.length;
      for (let j = 0; j < verts.length; j++)
        file +=
          '<element type="segment3d" label="e_{' +
          edge++ +
          '}"><show object="true" label="false" ev="4"/><objColor r="' +
          edgeColor[0] +
          '" g="' +
          edgeColor[1] +
          '" b="' +
          edgeColor[2] +
          '" alpha="0.0"/><layer val="0"/><labelMode val="0"/><auxiliary val="false"/><lineStyle thickness="2" type="0" typeHidden="1"/><outlyingIntersections val="false"/><keepTypeOnTransform val="true"/></element>';
    }
  }

  //Closing tags.
  file += "</construction></geogebra>";
  Library.fileName = Translation.firstToUpper(P.getName()) + ".ggb";

  //Save file.
  ggb.file("geogebra.xml", file);
  ggb
    .generateAsync({
      type: "blob",
      mimeType: 'application/vnd.geogebra.file; version="5"',
    })
    .then(Library.saveBlob);
};
