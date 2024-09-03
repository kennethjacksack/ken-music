// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 19; // Keep the camera position as it is

// Create a renderer with alpha transparency enabled
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Enable transparency
const container = document.getElementById('threeDContainer');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create a smaller geometry for the shape
const geometry = new THREE.IcosahedronGeometry(6, 2); // Decrease the scale for the shape

// Create a custom shader material
const vertexShader = `
    varying float vDistance;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(mvPosition.xy); // Use XY distance for radial gradient
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying float vDistance;
    uniform vec3 centerColor;
    uniform vec3 edgeColor;

    void main() {
        float maxDistance = 1.0; // Adjust this value to control the range of the gradient
        float factor = smoothstep(0.0, maxDistance, vDistance);
        vec3 color = mix(centerColor, edgeColor, factor);
        gl_FragColor = vec4(color, 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        centerColor: { value: new THREE.Color(0xffffff) }, // Bright color at the center
        edgeColor: { value: new THREE.Color(0x666666) }   // Slightly lighter color at the edges
    }
});

// Create the wireframe for the smaller shape
const wireframe = new THREE.WireframeGeometry(geometry);
const complexShape = new THREE.LineSegments(wireframe, shaderMaterial);
scene.add(complexShape);

// Create a larger ring around the shape with more space
const ringGeometry = new THREE.RingGeometry(8, 8.8, 100); // Adjust radii
const ringMaterial = new THREE.LineDashedMaterial({
    color: 0xcccccc, // Light gray color
    dashSize: 9,   // Longer dash length
    gapSize: 0,    // Longer gap length
    linewidth: 9   // Increased line width
});
const ring = new THREE.LineSegments(new THREE.WireframeGeometry(ringGeometry), ringMaterial);
ring.computeLineDistances(); // Compute line distances for dashed lines
ring.rotation.x = -Math.PI / 3.3;        // Tilt by -30 degrees
ring.rotation.y = -Math.PI / 8;          // Tilt by -30 degrees
scene.add(ring);

// Apply a slight tilt to both the shape and the ring in the opposite direction
complexShape.rotation.x = -Math.PI / 6; // Tilt by -30 degrees (opposite direction)
complexShape.rotation.y = -Math.PI / 6; // Tilt by -30 degrees (opposite direction)

// Add ambient light for less focused lighting
const ambientLight = new THREE.AmbientLight(0x606060); // Softer white light, slightly brighter
scene.add(ambientLight);

// Add a directional light with increased intensity for more noticeable lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // Increased intensity
directionalLight.position.set(10, 10, 10).normalize(); // Positioned for dramatic effect
scene.add(directionalLight);

// Add a point light with high intensity and large distance
const pointLight = new THREE.PointLight(0xffffff, 10, 50); // White light, intensity 10, distance 50
pointLight.position.copy(camera.position); // Position it at the camera's location
scene.add(pointLight);

// Add OrbitControls for interactive control
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth controls
controls.dampingFactor = 0.25;
controls.enableZoom = false; // Disable zoom
controls.enablePan = false;  // Disable panning

// Raycaster and mouse vector for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;

// Add event listeners for mouse interactions
renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);

// Mouse down event handler
function onMouseDown(event) {
    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with camera and mouse position
    raycaster.updateMatrixWorld();
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();

    // Check if the ray intersects the shape
    const intersects = raycaster.intersectObject(complexShape);

    if (intersects.length > 0) {
        isDragging = true;
    }
}

// Mouse up event handler
function onMouseUp(event) {
    isDragging = false;
}

// Mouse move event handler
function onMouseMove(event) {
    if (!isDragging) return;

    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with camera and mouse position
    raycaster.updateMatrixWorld();
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();

    // Check if the ray intersects the shape
    const intersects = raycaster.intersectObject(complexShape);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        // Update the shape's position based on the mouse movement
        complexShape.position.copy(intersect.point);
    }
}

// Render the scene
function render() {
    requestAnimationFrame(render);

    // Spin the ring slowly around its own center
    ring.rotation.z += 0.001; // Adjust the speed of rotation here

    // Only update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Start rendering
render();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
});
