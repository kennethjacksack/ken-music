// Ensure Three.js and OrbitControls are correctly loaded
if (typeof THREE === 'undefined' || typeof THREE.OrbitControls === 'undefined') {
    console.error('Three.js or OrbitControls not found. Make sure they are loaded.');
}

// Initialize the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube geometry
const geometry = new THREE.BoxGeometry();

// Load environment map texture
const textureLoader = new THREE.CubeTextureLoader();
const envMap = textureLoader.load([
    'textures/px.png', 'textures/nx.png',
    'textures/py.png', 'textures/ny.png',
    'textures/pz.png', 'textures/nz.png'
]);

// Create a glass-like material with environment map
const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    opacity: 0.6, // Semi-transparent
    transparent: true,
    roughness: 0.2, // Smooth surface
    metalness: 1.0, // Highly reflective
    envMap: envMap, // Environment map for reflections
    envMapIntensity: 1.0 // Reflectivity intensity
});

// Create a mesh for the cube with glass material
const cube = new THREE.Mesh(geometry, glassMaterial);
cube.position.set(0, 0, 0); // Position the cube in the center
scene.add(cube);

// Create edges for the cube
const edges = new THREE.EdgesGeometry(geometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
scene.add(edgeLines);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(5, 5, 5).normalize();
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(-5, 5, -5).normalize();
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight3.position.set(5, -5, -5).normalize();
scene.add(directionalLight3);

const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight4.position.set(-5, -5, 5).normalize();
scene.add(directionalLight4);

// Add OrbitControls for interactive rotation
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enables smooth control
controls.dampingFactor = 0.25; // Damping factor for smoother control
controls.enableZoom = true; // Enable zoom

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

animate();
