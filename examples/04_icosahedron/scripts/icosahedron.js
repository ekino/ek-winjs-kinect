var kinect = EKjs.Kinect.getInstance();
var body = kinect.bodyFrame.getSelectedBody();
var dragController = new EKjs.DragController(body,document.body,0.1,1);


var $container = $('#container');
var renderer = new THREE.WebGLRenderer({antialias: true});
var camera = new THREE.PerspectiveCamera(80,1,0.1,10000);
var scene = new THREE.Scene();



scene.add(camera);
renderer.setSize(400, 400);
$container.append(renderer.domElement);

///////////////////////////////////////////////

// Camera
camera.position.z = 200;

// Material
var pinkMat = new THREE.MeshPhongMaterial({
	color      :  new THREE.Color("#35e0be"),
	//emissive   :  new THREE.Color("#2075b8"),
	specular   :  new THREE.Color("#35e0be"),
	//specular   :  new THREE.Color("#227abd"),
	shininess  :  1,
	shading    :  THREE.FlatShading,
	transparent: 1,
	opacity    : 1
});

var L1 = new THREE.PointLight( 0xFFFFFF, 1);
L1.position.z = 100;
L1.position.y = 100;
L1.position.x = 100;
scene.add(L1);

var L2 = new THREE.PointLight( 0xFFFFFF, 0.8);
L2.position.z = 100;
L2.position.y = -50;
L2.position.x = -100;
scene.add(L2);

var L3 = new THREE.PointLight( 0xFFFFFF, 0.8);
L3.position.z = 100;
L3.position.y = -50;
L3.position.x = 100;
scene.add(L3);

// IcoSphere -> THREE.IcosahedronGeometry(80, 1) 1-4
var Ico = new THREE.Mesh(new THREE.IcosahedronGeometry(75,0), pinkMat);
Ico.rotation.z = 0.5;
scene.add(Ico);

function update(){
	//Ico.rotation.x+=2/50;
	//Ico.rotation.y+=2/100;

//	console.log(dragController)
	if(dragController.isRefresh())
	{
		/*var posX = -dragController.x+"px";
		var posY = -dragController.y+"px";
		var posZ = -dragController.z+"px";

		console.log(posX)*/

		var radianX = Math.PI * dragController.rotateX / 180;
		var radianY = Math.PI * dragController.rotateY / 180;
		Ico.rotation.x=radianX;
		Ico.rotation.y=radianY;
		//Ico.rotation.y+=-radianY;
		//Ico.rotation.y+=-dragController.rotateY/1000;

	}



	dragController.update();

}

// Render
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	update();
}

render();