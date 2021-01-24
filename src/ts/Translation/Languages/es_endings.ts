import { _language } from "./base";
import Ending from "../Basic/Ending";
import { Gender } from "../Basic/LanguageOptions";

// Helper function for toAdjective.
// Meant for Spanish.
// To be called within the Ending class.
// Turns everything except for the last word into an adjective and adds the
// last word with its grammatical gender modified accordingly.
const adjPrevWord = function (name: string, gender: Gender) {
  const i = name.lastIndexOf(" ");
  return (
    _language.toAdjective(name.substr(0, i), gender) +
    name.substr(i, name.length - i - 1) +
    (gender === Gender.male ? "o" : "a")
  );
};

const genderModifier = function (name: string, gender: Gender) {
  return name + (gender === Gender.male ? "o" : "a");
};

export default [
  new Ending("zada", adjPrevWord), // Cúpula pentagrámica cruzada
  new Ending("íada", -4, "iádic", genderModifier), // D(íada/iádic[o/a])
  new Ending("lda", -2, "ular"), // 5-cel(da/ular)
  new Ending("nda", -1, "áic", genderModifier), // Rotund(a/áic[o/a])
  new Ending("ia", 0, "l"), // Essenc(ia/ial)
  new Ending("la", -5, "upoidal"), // Cúpu(la/idal)
  new Ending("gula", -6, "angular"), // Estrella oct(ángula/angular)
  new Ending("ma", -3, "ámic", genderModifier), // Pentagr(ama/ámic[o/a])
  new Ending("sma", -1, "átic", genderModifier), // Prism(a/átic[o/a])
  new Ending("na", 0, "l"), // Esfenocorona(l)
  new Ending("ce", -5, "elicoidal"), // H(élice/elicoidal)
  new Ending("ide", -5, "amidal"), // Pir(ámide/amidal)
  new Ending("oide", -1, "al"), // Disfenoid(e/al)
  new Ending("nde", adjPrevWord), // Heptagrama grande
  new Ending("ng", -12, "l de Skilling"), // Figura( de Skilling/l de Skilling)
  new Ending("ium", -2, "al"), // Girobifastigi(um/al)
  new Ending("ón", -4, "d", genderModifier), // Tesela(ción/d[o/a])
  new Ending("bo", -3, "úbic", genderModifier), // C(ubo/úbic[o/a])
  new Ending("co", adjPrevWord), // Heptadecaedro diestrófico
  new Ending("ado", adjPrevWord), // Pentagrama cruzado
  // Icosaedro estrellado
  new Ending("rado", -1, "", genderModifier), // Cuadrad(o/[o/a])
  new Ending("go", -1, "mátic", genderModifier), // Teg(o/mátic[o/a])
  new Ending("jo", -3, "icial"), // Simpl(ejo/icial)
  new Ending("io", -1, "al"), // Girobifastigi(o/al)
  new Ending("lo", -1, "ar"), // Ditel(o/ar)
  new Ending("ángulo", -6, "angular"), // Tri(ángulo/angular)
  new Ending("íngulo", -6, "ingular"), // Dispfnoc(íngulo/ingular)
  new Ending("ano", adjPrevWord), // Tridecagrama mediano
  new Ending("ono", -5, "agonal"), // Pent(ágono/agonal)
  new Ending("po", -3, "ópic", genderModifier), // Pentat(opo/ópic[o/a])
  new Ending("dro", -1, "al"), // Tetraed(ro/al)
  new Ending("oro", -3, "órico"), // Pentac(oro/órico)
  new Ending("to", -4, "áctic", genderModifier), // Teseract(o/ic[o/a])
  new Ending("nto", -1, "al"), // 3-element(o/al)
  new Ending("unto", 1, "ual"), // Punt(o/ual)
  new Ending("ño", adjPrevWord), // Hendecagrama pequeño
  new Ending("or", adjPrevWord), // Hendecagrama mayor
  new Ending("is", adjPrevWord), // Dodecaedral pentakis
  new Ending("ex", -2, "icial"), // Simpl(ex/icial)
  new Ending("uz", 0, "ad", genderModifier), // Pentacruz(ad[o/a])
  new Ending("ié", -2, "odal"), // Trip(ié/odal)
];
