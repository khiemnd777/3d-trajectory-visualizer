// js/main.js

import * as THREE from 'three';
import { coordinates } from './calculations.js';
import { initThreeJS, createLine, createMarker, createCompass, createGroundPlane, fitCameraToObject } from './threejs-setup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { scene, camera, renderer, controls, labelRenderer } = initThreeJS();
  console.log('Scene, camera, renderer, controls, and labelRenderer initialized');

  const line = createLine(coordinates);
  scene.add(line);
  console.log('Line created and added to scene:', line);

  // Fit the camera to the line
  fitCameraToObject(camera, line, 1.75);
  console.log('Camera fitted to object');

  const marker = createMarker(scene);
  console.log('Marker created and added to scene:', marker);

  // Create and add compass
  const { compassScene, compassCamera, compassRenderer, compassLabelRenderer } = createCompass();
  console.log('Compass created and added to scene');

  // Create and add ground plane
  createGroundPlane(scene);
  console.log('Ground plane created and added to scene');

  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);

    // Copy the main camera's rotation to the compass camera
    compassCamera.quaternion.copy(camera.quaternion);

    // Reset compass camera position to keep it at a fixed distance
    const distance = 200; // Fixed distance from the origin
    compassCamera.position.set(
      distance * Math.sin(camera.rotation.y),
      distance,
      distance * Math.cos(camera.rotation.x)
    );
    compassCamera.lookAt(compassScene.position);

    compassRenderer.render(compassScene, compassCamera);
    compassLabelRenderer.render(compassScene, compassCamera);
  }
  animate();
  console.log('Rendering loop started');
});
