// js/main.js

import { coordinates } from './calculations.js';
import { initThreeJS, createLine, createMarker, createTextLabel, createAxes, createGroundPlane, fitCameraToObject } from './threejs-setup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { scene, camera, renderer, controls } = initThreeJS();
  console.log('Scene, camera, renderer, and controls initialized');

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
  await createTextLabel(scene, 'East', new THREE.Vector3(100, 0, 0));  // East is X
  await createTextLabel(scene, 'TVD', new THREE.Vector3(0, -100, 0));  // TVD is Y (inverted)
  await createTextLabel(scene, 'North', new THREE.Vector3(0, 0, 100));  // North is Z
  console.log('Text labels created and added to scene');

  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
  }
  animate();
  console.log('Rendering loop started');
});
