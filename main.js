// import * as THREE from 'three';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// window.addEventListener('load', function () {
//     // Create Scene
//     const scene = new THREE.Scene()
//     scene.background = new THREE.Color(0x00ff00);
//     scene.add(new THREE.AxesHelper(5))

//     // Add a light
//     const light = new THREE.PointLight(0xffffff, 1000)
//     light.position.set(2.5, 7.5, 15)
//     scene.add(light)

//     // Add a camera
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0.8, 1.4, 1.0)

//     const renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         alpha: true
//     });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(800, 600);

//     var container = document.getElementById('canvas');
//     container.appendChild(renderer.domElement);

//     // Add the orbit controls
//     const controls = new OrbitControls(camera, renderer.domElement)
//     controls.enableDamping = true
//     controls.target.set(0, 1, 0)

//     var mixer;
//     var modelReady = false;

//     // Load our FBX model from the directory
//     var loader = new FBXLoader();
//     loader.load("Walking.fbx", function (object) {

//         // Scale and position the model
//         object.scale.set(0.007, 0.007, 0.007)
//         object.position.set(0, 0, 0)

//         // Start the default animation
//         mixer = new THREE.AnimationMixer(object);
//         var action = mixer.clipAction(object.animations[0]);
//         action.play();

//         // Add it to the scene
//         scene.add(object);

//         modelReady = true

//     });

//     // Handle mouse interaction
//     var raycaster = new THREE.Raycaster();
//     var mouse = new THREE.Vector2();

//     window.addEventListener('mousemove', onMouseMove, false);

//     function onMouseMove(event) {
//         event.preventDefault();
//         mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//         mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
//         raycaster.setFromCamera(mouse, camera);

//         // Perform raycasting to check if the avatar is clicked
//         var intersects = raycaster.intersectObjects(scene.children, true);

//         if (intersects.length > 0) {
//             // Handle click events here
//             // For example, trigger animations or actions when the avatar is clicked
//         }
//     }

//     // Add animation routine
//     var clock = new THREE.Clock();
//     function animate() {
//         requestAnimationFrame(animate);

//         // Call the animate on the object
//         if (modelReady) mixer.update(clock.getDelta());

//         renderer.render(scene, camera);
//     }

//     animate();
// });


import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

let div3d, renderer, scene, camera, controls;
let meshArr=[];


init3d();
function init3d()
{

    scene=new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    camera=new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(10,10,10);
    camera.up= new THREE.Vector3(0,0,1)
    camera.lookAt(0,0,0);
    
    renderer=new THREE.WebGLRenderer({antialias:true});
    div3d = document.getElementById("div3d")
    div3d.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth,window.innerHeight);
    
    controls=new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    
    window.addEventListener("onResize", onWindowResize)
    document.getElementById("width").addEventListener("change", draw);
    document.getElementById("height").addEventListener("change", draw);
    document.getElementById("depth").addEventListener("change", draw);
    
    draw();
    infiniteLoop();
}

function draw()
{
    meshArr.forEach(e=>{
        e.geometry.dispose();
        e.material.dispose();
        scene.remove(e);
    });
    meshArr=[];

    while(scene.children.length>0){
        scene.remove(scene.children[0]);
    }

    console.log("before: ", scene.children.length)

    let w= parseFloat(document.getElementById("width").value);
    let h= parseFloat(document.getElementById("height").value);
    let d= parseFloat(document.getElementById("depth").value);
    
    console.log(w, h, d);

    let axis = new THREE.AxesHelper(25);
    scene.add(axis);
    
    let box = new THREE.BoxGeometry(3, 3, 3);
    let mat=new THREE.MeshBasicMaterial({
        color:new THREE.Color('#10834f'),
        transparent: true,
        opacity:0.25
    })
    let mesh= new THREE.Mesh(box, mat);
    mesh.scale.set(w,h,d)
    meshArr.push(mesh);


    meshArr.forEach(e=>{
        scene.add(e);
    });    

    console.log("after: ", scene.children.length)
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function infiniteLoop()
{
    onWindowResize();
    render();
    requestAnimationFrame(infiniteLoop);
}

function render(){
    renderer.render(scene, camera);
}

