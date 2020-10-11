//Configure OFF import button.
document.getElementById('file-input').addEventListener('change', Polytope.openOFF, false);

//Basic variables. Should probably be put in a class in the future.
var P; //Test variable. OFF imports to here.
var fillType = 0; //How are polytopes filled? Unused as of now.
var matrix; //Projection matrix. Unused as of now.
const epsilon = 0.000000000001; //A small number, used as a threshold for certain rendering operations.

//Configures the basic attributes of the scene.
var scene = new Scene(new THREE.Scene());
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 2;
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Adds both ambient light and directional light.
var ambientLight = new THREE.AmbientLight( 0x777777 );
scene.add( ambientLight );
var directionalLight = new THREE.DirectionalLight( 0x777777, 2 );
directionalLight.position.set( 1,1,1 ).normalize();
scene.add( directionalLight );

/* There's nothing to render yet, so uncommenting this code will result in an error.

//Render loop.
function animate() { 
	requestAnimationFrame( animate );
	for(var i=0;i<scene.children.length;i++) {
		if(scene.children[i].type==="Mesh") {
			scene.children[i].rotation.x += 0.01; scene.children[i].rotation.y += 0.01;
		}
	}
	renderer.render( scene, camera ); 
} 
animate();
*/	