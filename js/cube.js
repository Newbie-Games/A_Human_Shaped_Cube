// Create a scene, camera, and renderer

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("cube-container").appendChild(renderer.domElement);


window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  // Update the camera aspect ratio and the projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update the renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Create the cube structure
const cubeSize = 1;
const gap = 0.1;
const group = new THREE.Group();
const capabilityNames = ["Empathy", "Morality", "Intellect"];

for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

      const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        new THREE.MeshBasicMaterial({ color: 0x0000ff }),
        new THREE.MeshBasicMaterial({ color: 0xffff00 }),
        new THREE.MeshBasicMaterial({ color: 0xff00ff }),
        new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      ];

      const cube = new THREE.Mesh(geometry, materials);
      cube.position.set((cubeSize + gap) * (x - 1), (cubeSize + gap) * (y - 1), (cubeSize + gap) * (z - 1));
      cube.name = capabilityNames[Math.floor(Math.random() * capabilityNames.length)];

      // Store the original colors of the materials
      cube.userData.originalColors = materials.map((material) => material.color.clone());

      group.add(cube);
    }
  }
}

scene.add(group);

// Set camera position
camera.position.z = 10;

// Add arrow button event listeners for rotation
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    event.preventDefault(); // Add this line
    group.rotation.y += 0.1;
  } else if (event.code === "ArrowRight") {
    event.preventDefault(); // Add this line
    group.rotation.y -= 0.1;
  } else if (event.code === "ArrowUp") {
    event.preventDefault(); // Add this line
    group.rotation.x += 0.1;
  } else if (event.code === "ArrowDown") {
    event.preventDefault(); // Add this line
    group.rotation.x -= 0.1;
  }
});

// Add raycaster and mouse vector for handling click events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add the event listener for mouse clicks
document.addEventListener("mousedown", onDocumentMouseDown, false);

function onDocumentMouseDown(event) {
  event.preventDefault();
  if (gameOver) {
    return;
  }

  // Check if the clicked element is inside the chat window, and if so, return early
  const chatContainer = document.getElementById("chat-container");
  if (chatContainer === event.target || chatContainer.contains(event.target)) {
    return;
  }

  // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(group.children);

  // Debug: log intersects
  console.log("Intersects:", intersects);

  // If an object is intersected, call the restoreCapability function
  if (intersects.length > 0) {
    const selectedCube = intersects[0].object;
    const erodedCube = erodedCubes.find((erodedCube) => erodedCube.id === selectedCube.uuid);

    // Debug: log selectedCube and erodedCube
    console.log("Selected Cube:", selectedCube);
    console.log("Eroded Cube:", erodedCube);

    // Check if the block is eroded before restoring the capability
    if (erodedCube) {
      const capabilityIndex = coreCapabilities.findIndex((capability) => capability.name === erodedCube.capability);
      restoreCapability(capabilityIndex);
      updateCubeColor(); // Make sure to update the cube color after restoring the capability
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Add a function to start the erosion timer
function startErosionTimer() {
  initTimer();
}

