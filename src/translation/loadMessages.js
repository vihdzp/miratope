"use strict";

//-, one, two, three, four, five, six, seven, eight, nine, to Greek, back to each language.
//Used for Translation.greekPrefix.
var Translation = {};
Translation._units = {
	en: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"],
	es: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "enea"],
	de: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "okto", "ennea"]
};

//WARNING: THESE LABELS WILL PROBABLY BE MOVED AROUND A LOT.
Globalize.loadMessages({
	root: { //English is used as a fall-back.
		meta: {
			nounCapitalization: "false",
			adjBeforeNoun: "true",
			genderedLanguage: "false"
		},
		error: {
			unexpectedEOF: "Unexpected end of file!\nLine: {line}, column: {column}.",
			invalidNumber: "Invalid number!\nLine: {line}, column: {column}."
		},
		shape: {
			polytope: "polytope",
			nullitope: "nullitope",
			point: "point",
			dyad: "dyad",
			rectangle: "rectangle",
			triangle: "{count, plural, one {triangle} other {triangles}}",
			square: "{count, plural, one {square} other {squares}}",
			cube: "cube",
			tesseract: "tesseract",
			bowtie: "bowtie"
		},
		family: {
			prism: "prism",
			pyramid: "pyramid",
			bipyramid: "bipyramid",
			antiprism: "antiprism",
			tegum: "tegum",
			cupola: "cupola",
			cuploid: "cuploid",
			cupolaicBlend: "cupolaic blend"
		},
		grammar: {
			starName: "{count, plural, one {{prefix}gram} other {{prefix}grams}}"
		},
		greekPrefixes: {
			nulli: "nulli",
			mono: "mono",
			deca: "deca",
			conta: "conta",
			dodeca: "dodeca",
			icosa: "icosa",
			icosi: "icosi",
			triaconta: "triaconta",
			hecto: "hecto",
			hecaton: "hecaton",
			cosi: "cosi",
			dia: "dia",
			chilia: "chilia",
			dis: "dis",
			tris: "tris",
			myria: "myria"
		},
		modifiers: {
			small: "small",
			medial: "medial",
			great: "great",
			grand: "grand"
		},
		misc: {
			component: "{count, plural, many {components} other {component}}",
			compound: "compound",
			cross: "cross",
			plex: "plex",
			crossed: "crossed",
			strophic: "strophic",
			element: "element"
		}
	},
	es: {
		meta: {
			nounCapitalization: "false",
			adjBeforeNoun: "false",
			genderedLanguage: "true"
		},
		shape: {
			polytope: "politopo",
			nullitope: "nulitopo",
			point: "punto",
			dyad: "díada",
			rectangle: "rectángulo",
			triangle: "triángulo",
			square: "cuadrado",
			cube: "cubo",
			tesseract: "teseracto",
			bowtie: "moño"
		},
		family: {
			prism: "prisma",
			pyramid: "pirámide",
			antiprism: "antiprisma",
			bipyramid: "bipirámide",
			tegum: "tego",
			cupola: "cúpula",
			cuploid: "cuploide",
			cupolaicBlend: "mezcla cupoléica"
		},
		grammar: {
			starName: "{count, plural, one {{prefix}grama} other {{prefix}gramas}}"
		},
		greekPrefixes: {
			/*deca: "deca",
			conta: "conta",
			dodeca: "dodeca",
			icosa: "icosa",
			icosi: "icosi",
			triaconta: "triaconta",
			hecto: "hecto",
			hecaton: "hecaton",
			cosi: "cosi",
			dia: "dia",
			chilia: "chilia",
			dis: "dis",
			tris: "tris",*/
			myria: "miria"
		},
		modifiers: {
			small: "{gender, select, male {pequeño} other {pequeña}}",
			medial: "{gender, select, male {mediano} other {pequeña}}",
			great: "grande",
			grand: "mayor"
		},
		misc: {
			component: "{count, plural, one {componente} other {componentes}}",
			compound: "compuesto",
			nulli: "nuli",
			//mono: "mono",
			cross: "cruz",
			plex: "plejo",
			crossed: "{gender, select, male {cruzado} other {cruzada}}",
			strophic: "estrófico",
			element: "elemento"
		}
	},
	de: {
		meta: {
			nounCapitalization: "true",
			adjBeforeNoun: "true",
			genderedLanguage: "true"
		},
		greekPrefixes: {
			deca: "deka",
			//conta: "conta",
			dodeca: "dodeka",
			icosa: "ikosa",
			icosi: "ikosi",
			//triaconta: "triakonta",
			hecto: "hekto",
			hecaton: "hekaton",
			cosi: "kosi",
			dia: "dia",
			/*chilia: "chilia",
			dis: "dis",
			tris: "tris",
			myria: "myria"*/
		}
	},
	en: {} //DON'T FILL THIS!
});
