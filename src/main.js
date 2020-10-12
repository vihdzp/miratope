//Configure OFF import button.
document.getElementById('file-input').addEventListener('change', Polytope.openOFF, false);

//Basic variables. Should probably be put in a class in the future.
var P; //Test variable. OFF imports to here.
const epsilon = 0.000000000001; //A small number, used as a threshold for certain rendering operations. Should probs be reworked.

//Configures the basic attributes of the scene.
var mainScene = new Scene(new THREE.Scene());
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 2;
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Adds both ambient light and directional light.
var ambientLight = new THREE.AmbientLight( 0x777777 );
mainScene.scene.add( ambientLight );
var directionalLight = new THREE.DirectionalLight( 0x777777, 2 );
directionalLight.position.set( 1,1,1 ).normalize();
mainScene.scene.add( directionalLight );