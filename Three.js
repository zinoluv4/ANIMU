<script type="module">
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";
// 1. Import OrbitControls
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, bottle, controls;
const container = document.getElementById("bottle-container");

// === Scene Setup ===
scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f7f8);

// === Camera ===
camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 1.2, 3);

// === Renderer ===
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// 2. Initialize OrbitControls
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth motion
controls.dampingFactor = 0.05;
controls.minDistance = 2; // Prevent zooming too close
controls.maxDistance = 10; // Prevent zooming too far
controls.autoRotate = true; // Initial auto-rotate
controls.autoRotateSpeed = 2.0;

// Set the target for the controls
controls.target.set(0, 0.5, 0); // Assuming the bottle's center is around y=0.5
controls.update();


// === Lighting ===
const ambient = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// === Load the 3D Bottle ===
const loader = new GLTFLoader();
loader.load(
  "bottle.glb", // 🔥 rename your file to bottle.glb for reliability
  (gltf) => {
    bottle = gltf.scene;

    // Scale, center, and position
    bottle.scale.set(3, 3, 3);
    bottle.position.set(0, -1, 0);
    // Remove the bottle's initial rotation since OrbitControls will handle it
    // bottle.rotation.y = Math.PI; 

    scene.add(bottle);

    // Optional: Adjust the camera and target based on the loaded bottle
    const box = new THREE.Box3().setFromObject(bottle);
    const center = box.getCenter(new THREE.Vector3());
    controls.target.copy(center); 
    controls.update();


    console.log("✅ ANIMU bottle loaded successfully");
  },
  undefined,
  (error) => {
    console.error("❌ Error loading ANIMU bottle:", error);
  }
);

// === Resize Responsiveness ===
window.addEventListener("resize", () => {
  const container = document.getElementById("bottle-container");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// 4. Remove custom drag logic (replaced by OrbitControls)
// 5. Stop auto-rotate on user interaction
renderer.domElement.addEventListener('pointerdown', () => {
  controls.autoRotate = false;
});

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);
  // 3. Update controls in the animation loop
  controls.update(); 
  renderer.render(scene, camera);
}
animate();
</script>