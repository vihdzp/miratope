Globalize.loadMessages({
	root: { //English is used as a fall-back.
		error: {
			unexpectedEOF: "Unexpected end of file!\nLine: {line}, column: {column}.",
			invalidNumber: "Invalid number!\nLine: {line}, column: {column}.",
		},
		shape: {
			polytope: "polytope",
			dyad: "dyad",
			prism: "prism",
			pyramid: "pyramid",
			antiprism: "antiprism",
			bipyramid: "bipyramid",
			tegum: "tegum",
			rectangle: "rectangle",
			triangle: "triangle",
			square: "square",
			cupola: "cupola",
			cuploid: "cuploid",
			cupolaicBlend: "cupolaic blend",
		},
		construction: {
			familyMember: "{nameAdj} {family}"
		},
		misc: {
			component: "{plural, select, one {component}, many {components}}",
			compound: "compound",
		}
	},
	es: {
		shape: {
			polytope: "politopo",
			dyad: "díada"
		},
		construction: {
			familyMember: "{family} {nameAdj}"
		}
	},
	de: {},
	en: {}, //DON'T FILL THIS!
});
