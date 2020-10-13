//Configure OFF import button.
document.getElementById('file-input').addEventListener('change', Polytope.openOFF, false);

//Basic variables. Should probably be put in a class in the future.
var P; //Temp variable. OFF imports to here.
const epsilon = 0.000000000001; //A small number, used as a threshold for certain rendering operations. Should probs be reworked.

//Configures the basic attributes of the scene.
var mainScene = new Scene();