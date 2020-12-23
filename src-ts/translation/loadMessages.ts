import * as Globalize from 'globalize';

//WARNING: THESE LABELS WILL PROBABLY BE MOVED AROUND A LOT.
export function loadMessages() {Globalize.loadMessages({
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
			polytope: "polytope{count, plural, one {} other {s}}",
			nullitope: "nullitope{count, plural, one {} other {s}}",
			point: "point{count, plural, one {} other {s}}",
			dyad: "dyad{count, plural, one {} other {s}}",
			rectangle: "rectangle{count, plural, one {} other {s}}",
			triangle: "triangle{count, plural, one {} other {s}}",
			square: "square{count, plural, one {} other {s}}",
			cube: "cube{count, plural, one {} other {s}}",
			tesseract: "tesseract{count, plural, one {} other {s}}",
			bowtie: "bowtie{count, plural, one {} other {s}}"
		},
		element: {
			el0: "vert{count, plural, one {ex} other {ices}}",
			el1: "edge{count, plural, one {} other {s}}",
			el2: "face{count, plural, one {} other {s}}",
			el3: "cell{count, plural, one {} other {s}}",
			el4: "ter{count, plural, one {on} other {a}}",
			el5: "pet{count, plural, one {on} other {a}}",
			el6: "ex{count, plural, one {on} other {a}}",
			el7: "zett{count, plural, one {on} other {a}}",
			el8: "yott{count, plural, one {on} other {a}}",
			el9: "xenn{count, plural, one {on} other {a}}",
			el10: "dak{count, plural, one {on} other {a}}",
			el11: "hendak{count, plural, one {on} other {a}}",
			el12: "dok{count, plural, one {on} other {a}}",
			el13: "tradak{count, plural, one {on} other {a}}",
			el14: "teradak{count, plural, one {on} other {a}}",
			el15: "petadak{count, plural, one {on} other {a}}",
			el16: "exadak{count, plural, one {on} other {a}}",
			el17: "zettadak{count, plural, one {on} other {a}}",
			el18: "yottadak{count, plural, one {on} other {a}}",
			el19: "xendak{count, plural, one {on} other {a}}",
			el20: "ic{count, plural, one {on} other {a}}",
			el21: "iken{count, plural, one {on} other {a}}",
			el22: "icod{count, plural, one {on} other {a}}",
			el23: "ictr{count, plural, one {on} other {a}}",
			el24: "icter{count, plural, one {on} other {a}}",
			el25: "icpet{count, plural, one {on} other {a}}",
			el26: "icex{count, plural, one {on} other {a}}",
			el27: "iczett{count, plural, one {on} other {a}}",
			el28: "icyott{count, plural, one {on} other {a}}",
			el29: "icxenn{count, plural, one {on} other {a}}",
			el30: "trac{count, plural, one {on} other {a}}",
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
			starName: "{prefix}gram{count, plural, one {} other {s}}"
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
});};
