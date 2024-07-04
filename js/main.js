// js/main.js

import * as THREE from 'three';
import { coordinates } from './calculations.js';
import { initThreeJS, createLine, createMarker, createTextLabel, createAxes, createGroundPlane, fitCameraToObject } from './threejs-setup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { scene, camera, renderer, controls, labelRenderer } = initThreeJS();
  console.log('Scene, camera, renderer, controls, and labelRenderer initialized');

  const line = createLine(coordinates);
  scene.add(line);
  console.log('Line created and added to scene:', line);

  // Fit the camera to the line
  fitCameraToObject(camera, line);
  console.log('Camera fitted to object');

  const marker = createMarker(scene);
  console.log('Marker created and added to scene:', marker);

  // Create and add axes
  createAxes(scene);
  console.log('Axes created and added to scene');

  // Create and add ground plane
  createGroundPlane(scene);
  console.log('Ground plane created and added to scene');

  // Create text labels for axes
  createTextLabel(scene, 'West', new THREE.Vector3(-100, 10, 0));  // West is X
  createTextLabel(scene, 'East', new THREE.Vector3(100, 10, 0));  // East is X
  // await createTextLabel(scene, 'TVD', new THREE.Vector3(0, -100, 0));  // TVD is Y (inverted)
  createTextLabel(scene, 'North', new THREE.Vector3(0, 10, -100));  // North is Z
  createTextLabel(scene, 'South', new THREE.Vector3(0, 10, 100));  // South is Z

  console.log('Text labels created and added to scene');

  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  animate();
  console.log('Rendering loop started');
});
