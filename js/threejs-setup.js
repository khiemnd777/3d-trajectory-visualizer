// js/threejs-setup.js
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function initThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.pointerEvents = 'none'; // Ensure it doesn't interfere with controls
  renderer.domElement.parentElement.appendChild(labelRenderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.enablePan = false; // Disable panning
  controls.minDistance = 10;
  controls.maxDistance = 5000;
  controls.maxPolarAngle = Math.PI / 2;

  // Set pivot point
  const pivot = new THREE.Vector3(0, 50, 0);
  controls.target.copy(pivot);
  controls.update();

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Add a small marker at the pivot point for visualization
  const pivotMarkerGeometry = new THREE.SphereGeometry(1, 32, 32);
  const pivotMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const pivotMarker = new THREE.Mesh(pivotMarkerGeometry, pivotMarkerMaterial);
  pivotMarker.position.copy(pivot);
  scene.add(pivotMarker);

  camera.position.set(0, 100, 200); // Set initial camera position
  controls.update(); // Required if controls.enableDamping or controls.autoRotate

  console.log('Three.js initialized:', {
    scene,
    camera,
    renderer,
    controls,
    labelRenderer,
    pivot,
    pivotMarker
  });

  return { scene, camera, renderer, controls, labelRenderer, pivot, pivotMarker };
}

function createLine(coordinates) {
  // Calculate the maximum TVD value
  const maxTvd = Math.max(...coordinates.map((coord) => coord.tvd));

  // Adjust the TVD values and prepare positions array
  const positions = coordinates.flatMap((coord) => [
    coord.east,
    maxTvd / 10 - coord.tvd / 10,
    -coord.north,
  ]);

  const geometry = new LineGeometry();
  geometry.setPositions(positions);

  const material = new LineMaterial({
    color: 0xffff00, // Yellow color
    linewidth: 5, // Adjust the width as needed
  });
  material.resolution.set(window.innerWidth, window.innerHeight);

  const line = new Line2(geometry, material);
  console.log('Line created:', line);
  return line;
}

function createMarker(scene) {
  const markerGeometry = new THREE.SphereGeometry(2, 32, 32);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(0, 10, 0);
  scene.add(marker);
  console.log('Marker created and added to scene:', marker);
  return marker;
}

function createTextLabel(scene, text, position) {
  const div = document.createElement('div');
  div.className = 'label';
  div.textContent = text;
  div.style.color = 'black';
  div.style.fontSize = '26px';
  div.style.fontWeight = 'bold';

  const label = new CSS2DObject(div);
  label.position.copy(position);
  scene.add(label);

  console.log(`Text label "${text}" created and added to scene:`, label);
  return label;
}

function createAxes(scene) {
  const axesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const axesGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(-100, 10, 0), // X axis (West)
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(100, 10, 0), // -X axis (East)
    // new THREE.Vector3(0, 0, 0),
    // new THREE.Vector3(0, -100, 0), // Y axis (TVD, inverted)
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(0, 10, -100), // Z axis (North)
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(0, 10, 100), // -Z axis (South)
  ]);
  const axes = new THREE.LineSegments(axesGeometry, axesMaterial);
  scene.add(axes);
  console.log('Axes created and added to scene:', axes);
}

function createGroundPlane(scene) {
  const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
  console.log('Ground plane created and added to scene:', plane);
}

function fitCameraToObject(camera, object, offset = 1.25) {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(object);

  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance =
    maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = offset * Math.max(fitHeightDistance, fitWidthDistance);

  const direction = new THREE.Vector3(1, 1, 1).normalize(); // Default direction adjusted to view the object

  camera.position.copy(direction.multiplyScalar(distance).add(center));
  camera.near = distance / 100;
  camera.far = distance * 100;

  camera.lookAt(center);
  camera.updateProjectionMatrix();

  console.log('fitCameraToObject:', {
    boundingBox,
    center,
    size,
    maxSize,
    fitHeightDistance,
    fitWidthDistance,
    distance,
    direction,
    cameraPosition: camera.position,
    near: camera.near,
    far: camera.far,
  });
}

export {
  initThreeJS,
  createLine,
  createMarker,
  createTextLabel,
  createAxes,
  createGroundPlane,
  fitCameraToObject,
};
