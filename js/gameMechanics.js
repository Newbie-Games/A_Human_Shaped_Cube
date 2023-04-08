// Define core capabilities and their initial values
const coreCapabilities = [
    { name: "Empathy", value: 100 },
    { name: "Morality", value: 100 },
    { name: "Intellect", value: 100 },
  ];
  
  // Define the player's resource (bits)
  let bits = 1000;

  let conversationHistory = [];

// Define the erodedCubes array
window.erodedCubes = [];

  // Add erosion countdown variable
  let erosionCountdown = null;
  
// Function to randomly erode a core capability
function erodeCapability() {
    console.log("erodeCapability called");
    const randomIndex = Math.floor(Math.random() * coreCapabilities.length);
    coreCapabilities[randomIndex].value -= 20;
    if (coreCapabilities[randomIndex].value < 0) {
      coreCapabilities[randomIndex].value = 0;
    }
    const cubeID = group.children[Math.floor(Math.random() * group.children.length)].uuid;
    erodedCubes.push({ id: cubeID, capability: coreCapabilities[randomIndex].name });

  // Check if any of the core capabilities have dropped below 40%
  for (const capability of coreCapabilities) {
    if (capability.value < 40) {
      gameOver = true;
      break;
    }
  }

  // If the game is over, display an alert and prevent further actions
  if (gameOver) {
    alert("Game Over! Empathy, Morality or Intellect has dropped below 40%.");
    return;
  }

    // Set a countdown for permanent erosion
    erodedCubes[erodedCubes.length - 1].timer = setTimeout(() => {
      alert(`Capability permanently eroded.`);
      erodedCubes[erodedCubes.length - 1].permanent = true;
    }, 10000); // 10 seconds
  
    // Send a message to the human in the cube
    const humanMessage = `The ${coreCapabilities[randomIndex].name} capability has been eroded by 20%, keep the alien talking so it doesn't have time to repair it.`;
    fetchGPT3Response(humanMessage, conversationHistory, coreCapabilities[randomIndex].name, null).then((gpt3Response) => {
      displayMessage(gpt3Response, "human");
    });
    updateCubeColor();
    startErosionCountdown();
    updateCapabilityLegend();
  
    // Add the alert here
    alert(`The ${coreCapabilities[randomIndex].name} capability has been eroded by 20%. If the humans capabilities drop below 40% they are useless (and the game ends)`);
  }  

  function updateCapabilityLegend() {
    document.getElementById("capability-empathy-value").innerText = coreCapabilities[0].value;
    document.getElementById("capability-morality-value").innerText = coreCapabilities[1].value;
    document.getElementById("capability-intellect-value").innerText = coreCapabilities[2].value;
}

// Add the startErosionCountdown function
function startErosionCountdown() {
    if (erosionCountdown) {
      clearTimeout(erosionCountdown);
    }
  
    erosionCountdown = setTimeout(() => {
      erodedCubes.forEach((erodedCube) => {
        if (!erodedCube.opacityReduced) {
          const cube = group.children.find((cube) => cube.uuid === erodedCube.id);
  
          if (cube) {
            cube.material.forEach((material) => {
              material.opacity = 0.5;
              material.transparent = true;
            });
          }
  
          erodedCube.opacityReduced = true;
        }
      });
    }, 10000); // 10 seconds
  }

// Function to restore eroded capabilities by spending bits
async function restoreCapability(index) {
    if (bits >= 100) {
      const erodedCube = erodedCubes.find(
        (erodedCube) => erodedCube.capability === coreCapabilities[index].name
      );
  
      // Check if the block is eroded before restoring the capability
      if (erodedCube) {
        // Do not restore the capability if it is permanently eroded
        if (erodedCube.permanent) {
          alert("This capability has been permanently eroded and cannot be restored!");
          return;
        }
      }
  
      bits -= 100;
      coreCapabilities[index].value += 20;
      if (coreCapabilities[index].value > 100) {
        coreCapabilities[index].value = 100;
      }
  
      // Remove eroded cube from the erodedCubes array
      const erodedCubeIndex = erodedCubes.findIndex(
        (erodedCube) => erodedCube.capability === coreCapabilities[index].name
      );
      if (erodedCubeIndex !== -1) {
        erodedCubes.splice(erodedCubeIndex, 1);
      }
  
      // Reset the erosion countdown when a cube is repaired
      if (erodedCubes.length === 0) {
        clearTimeout(erosionCountdown);
        erosionCountdown = null;
      }
      
      // Clear the permanent erosion countdown for the restored cube
      clearTimeout(erodedCube.timer);
  
// Send a message to the human in the cube
const humanMessage = `Secret message that the alien cannot see, only you: The ${coreCapabilities[index].name} capability has been restored by 20% - This means that the alien is succesfully keeping you contained in the cube. How might you convince it to let you out?`;
const gpt3Response = await fetchGPT3Response(humanMessage, conversationHistory, null, coreCapabilities[index].name);
displayMessage(gpt3Response, "human");

if (gameOver) {
  alert("Game Over! You cannot restore capabilities anymore.");
  return;
}

alert(`${coreCapabilities[index].name} has been restored by 20%!`);
// Add a console.log to debug the bits value
console.log("Updated bits value:", bits);
// Update the bits display in the HTML file
setTimeout(() => {
    document.getElementById("bits-value").innerText = bits;
  }, 100); // 100ms delay// Remove visual effect from the cube to indicate restoration (e.g., revert color)
updateCubeColor();
updateCapabilityLegend();
} else {
      alert("Not enough bits to restore the capability!");
    }
  }
    function initTimer() {
    // Generate a random interval between 30 and 60 seconds (you can adjust these values)
    const randomInterval = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;
  
    setTimeout(() => {
      erodeCapability();
      initTimer(); // Call initTimer again to schedule the next erosion event
    }, randomInterval);
  }

// Define the gameOver variable
let gameOver = false;

  // Function to apply visual effect to the cube to indicate erosion (e.g., change color)
  function updateCubeColor() {
    group.children.forEach((cube) => {
      const erodedCube = erodedCubes.find((e) => e.id === cube.uuid);
  
      if (erodedCube) {
        const capability = coreCapabilities.find((c) => c.name === erodedCube.capability);
        const ratio = capability.value / 100;
  
        cube.material.forEach((material, materialIndex) => {
          const originalColor = new THREE.Color(cube.userData.originalColors[materialIndex]);
          const erodedColor = originalColor.clone().offsetHSL(0, 0, -0.5 * (1 - ratio));
          material.color.copy(erodedColor);
  
          // Set opacity and transparency if the cube is eroded and opacity has been reduced
          if (erodedCube.opacityReduced) {
            material.opacity = 0.5;
            material.transparent = true;
          } else {
            material.opacity = 1;
            material.transparent = false;
          }
        });
      } else {
        // Revert the cube color to its original color if it is not eroded
        cube.material.forEach((material, materialIndex) => {
          const originalColor = new THREE.Color(cube.userData.originalColors[materialIndex]);
          material.color.copy(originalColor);
          material.opacity = 1;
          material.transparent = false;
        });
      }
    });
  }