import './style.css';
import { mean, min } from 'mathjs'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import weahterInfo from './data/new_england_temperature.json';

// extract revalent weather information
let weatherInfoByState = [];
let coordinateX = [];
let coordinateY = [];
let allTemperatures = [];

for (const [stateKey, stateVal] of Object.entries(weahterInfo)) {
    for (const [gridPointKey, gridPointVal] of Object.entries(stateVal)) {
        const coordinateString = gridPointKey.split('-');
        const coordinateTuple = [parseFloat(coordinateString[1]), parseFloat(coordinateString[2])];
        coordinateX.push(coordinateTuple[0]);
        coordinateY.push(coordinateTuple[1]);
        allTemperatures.push(gridPointVal[0].value);
    }
}

const xMean = mean(coordinateX);
const yMean = mean(coordinateY);
const tempMean = min(allTemperatures);

for (const [stateKey, stateVal] of Object.entries(weahterInfo)) {
    for (const [gridPointKey, gridPointVal] of Object.entries(stateVal)) {
        const coordinateString = gridPointKey.split('-');
        const coordinateTuple = [parseFloat(coordinateString[1]), parseFloat(coordinateString[2])];
        const temperature = gridPointVal[0].value;
        console.log(temperature - tempMean);
        weatherInfoByState.push([coordinateTuple[0] - xMean, coordinateTuple[1] - yMean, temperature - (tempMean/2)]);
    }
}

// obtain the canvas
const canvas = document.getElementById("canvas");

// create the scene
const scene = new THREE.Scene();

// create the object
weatherInfoByState.forEach(each_point => {
    const [xValue, yValue, zValue] = each_point;
    const tempBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, zValue), new THREE.MeshBasicMaterial({color: "blue"}))
    scene.add(tempBox);
    tempBox.position.set(yValue * 10, xValue * 10, zValue);
})

// const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: "blue"}));
// scene.add(box1);

// create the camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10;
scene.add(camera);

// camera control
const controls = new OrbitControls(camera, canvas);

// render the scene
const renderer = new THREE.WebGLRenderer({
    canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

scene.background = new THREE.Color( 0xe4e6eb );

// animation
const clock = new THREE.Clock();
const tick = () => {
    const deltaTime = clock.getElapsedTime();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick)
};

tick();