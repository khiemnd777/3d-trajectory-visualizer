// js/threejs-setup.js

function initThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 5000;
  controls.maxPolarAngle = Math.PI / 2;

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  console.log('Three.js initialized:', { scene, camera, renderer, controls });

  return { scene, camera, renderer, controls };
}

function createLine(coordinates) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(coordinates.flatMap(coord => [coord.east, 1000 - coord.tvd / 10, coord.north])); // Invert Y axis
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const material = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 1000 }); // Yellow color and thicker line
  const line = new THREE.Line(geometry, material);
  console.log('Line created:', line);
  return line;
}

function createMarker(scene) {
  const markerGeometry = new THREE.SphereGeometry(2, 32, 32);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  scene.add(marker);
  console.log('Marker created and added to scene:', marker);
  return marker;
}

function createTextLabel(scene, text, position) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
      const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 5,
        height: 1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow color
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.copy(position);
      scene.add(textMesh);
      console.log(`Text label "${text}" created and added to scene:`, textMesh);
      resolve(textMesh);
    });
  });
}

function createAxes(scene) {
  const axesMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
  const axesGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(100, 0, 0), // X axis (East)
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -100, 0), // Y axis (TVD, inverted)
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 100), // Z axis (North)
  ]);
  const axes = new THREE.LineSegments(axesGeometry, axesMaterial);
  scene.add(axes);
  console.log('Axes created and added to scene:', axes);
}

function createGroundPlane(scene) {
  const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = - Math.PI / 2;
  scene.add(plane);
  console.log('Ground plane created and added to scene:', plane);
}

function fitCameraToObject(camera, object, offset = 1.25) {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(object);

  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
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

export { initThreeJS, createLine, createMarker, createTextLabel, createAxes, createGroundPlane, fitCameraToObject };
