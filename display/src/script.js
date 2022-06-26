import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// obtain the canvas
const canvas = document.getElementById("canvas");

// create the scene
const scene = new THREE.Scene();

// create the object
const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: "blue"}));
scene.add(box1);

// create the camera
const cameraSize = {
    width: 800,
    height: 800
};

const camera = new THREE.PerspectiveCamera(75, cameraSize.width / cameraSize.height);
camera.position.z = 10;
scene.add(camera);

// camera control
const controls = new OrbitControls(camera, canvas);

// render the scene
const renderer = new THREE.WebGLRenderer({
    canvas
});

renderer.setSize(cameraSize.width, cameraSize.height);

scene.background = new THREE.Color( 0xe4e6eb );

// animation
const clock = new THREE.Clock();
const tick = () => {
    const deltaTime = clock.getElapsedTime();

    //box1.rotation.x = deltaTime;
    //box1.rotation.y = deltaTime;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick)
};

tick();