// === ANIMU 3D BOTTLE VIEWER ===
// by Zino for ANIMU Perfume

import * as THREE from "BOTTLE CODE 3.glb";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer, bottle;

// === Scene Setup ===
scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f7f8); // soft neutral gray-white

// === Camera ===
camera = new THREE.PerspectiveCamera(45, window.innerWidth / 500, 0.1, 100);
camera.position.set(0, 1.2, 3);

// === Renderer ===
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, 500);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("bottle-container").appendChild(renderer.domElement);

// === Lighting Setup ===
const ambientLight = new THREE.AmbientLight(0xffffff, 2.2); // strong fill light
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// === Load the ANIMU Bottle Model ===
const loader = new GLTFLoader();
loader.load(
  "BOTTLE", // ⚠️ Make sure your file name matches exactly
  (gltf) => {
    bottle = gltf.scene;

    // Scale, position, and rotate the bottle
    bottle.scale.set(3, 3, 3);
    bottle.position.set(0, -1, 0);
    bottle.rotation.y = Math.PI;

    scene.add(bottle);

    // Center camera on object automatically
    const box = new THREE.Box3().setFromObject(bottle);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;
    camera.position.set(0, center.y, cameraZ);
    camera.lookAt(center);

    console.log("✅ ANIMU bottle loaded successfully");
  },
  undefined,
  (error) => {
    console.error("❌ Error loading ANIMU bottle:", error);
  }
);

// === Mouse Drag Rotation ===
let isDragging = false;
let prevX = 0;

renderer.domElement.addEventListener("mousedown", (e) => {
  isDragging = true;
  prevX = e.clientX;
});

renderer.domElement.addEventListener("mouseup", () => (isDragging = false));

renderer.domElement.addEventListener("mousemove", (e) => {
  if (isDragging && bottle) {
    const delta = e.clientX - prevX;
    bottle.rotation.y += delta * 0.01;
    prevX = e.clientX;
  }
});

// === Resize Responsiveness ===
window.addEventListener("resize", () => {
  const container = document.getElementById("bottle-container");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);
  if (bottle && !isDragging) {
    bottle.rotation.y += 0.003; // subtle auto-rotate
  }
  renderer.render(scene, camera);
}
animate();
