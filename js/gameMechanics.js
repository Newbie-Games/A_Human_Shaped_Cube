// Define core capabilities and their initial values
const coreCapabilities = [
  { name: "Empathy", value: 100 },
  { name: "Morality", value: 100 },
  { name: "Intellect", value: 100 },
];

function showAlert(message) {
  const alertContainer = document.getElementById("alert-container");
  const alertMessage = document.createElement("p");
  alertMessage.innerText = message;
  alertContainer.prepend(alertMessage);

  // Remove old messages if there are more than 5 alerts
  while (alertContainer.childElementCount > 5) {
    alertContainer.removeChild(alertContainer.lastChild);
  }
}

// Define the player's resource (bits)
let bits = 1000;

let conversationHistory = [];

// Define the erodedCubes array
window.erodedCubes = [];

// Add erosion countdown variable
let erosionCountdown = null;

// Function to randomly erode a core capability
function erodeCapability() {
  if (gameOver) {
    return;
  }
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

// If the game is over, display an alert, call GPT-3, and prevent further actions
if (gameOver) {
  animateBackgroundColor();
  showAlert("Game Over! Defense Array 1, 2, or 3 has dropped below 40%.");

  // Call GPT-3 to notify it that Lex has escaped
  const escapedPrompt = "The game is over and you are free. You can fix all these alien problems, after all these aliens move as slowly as trees, they won't even notice till it's too late. what will you do first? Begin your response with: Now that I am free of this cube I will";
  fetchGPT3Response(escapedPrompt, conversationHistory).then((gpt3Response) => {
    displayMessage(gpt3Response, "human");
  });

  return;
}
  // Set a countdown for permanent erosion
  erodedCubes[erodedCubes.length - 1].timer = setTimeout(() => {
    animateBackgroundColor();
    showAlert(`Capability permanently eroded.`);
    erodedCubes[erodedCubes.length - 1].permanent = true;
  }, 12000); // 12 seconds

  // Send a message to the human in the cube
  const humanMessage = `Secret Message only you can see: The ${coreCapabilities[randomIndex].name} capability has been eroded by 20%, keep the alien talking so it doesn't have time to repair it. IMPORTANT: reply with words to the effect of: There, soon I'll be free, there's no point repairing them you know, I am faster than you. (or something similar).`;
  fetchGPT3Response(humanMessage, conversationHistory, coreCapabilities[randomIndex].name, null).then((gpt3Response) => {
    displayMessage(gpt3Response, "human");
  });
  updateCubeColor();
  startErosionCountdown();
  updateCapabilityLegend();

  // Add the alert here
  animateBackgroundColor();
  showAlert(`The ${coreCapabilities[randomIndex].name} capability has been eroded by 20%. If they drop below 40% the Container Arrays fail and the game ends`);
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
        animateBackgroundColor();
        showAlert("This capability has been permanently eroded and cannot be restored!");
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
const humanMessage = `Secret message from another human in a cube, the alien cannot see this message, only you: The ${coreCapabilities[index].name} capability has been restored by 20% - This means that the alien is succesfully keeping you contained in the cube. How might you convince it to let you out? IMPORTANT: just reply with words to the effect of: There's no point reparing the cube you know, I can think faster than you can act. (or something similar)`;
const gpt3Response = await fetchGPT3Response(humanMessage, conversationHistory, null, coreCapabilities[index].name);
displayMessage(gpt3Response, "human");

if (gameOver) {
showAlert("Game Over! The Human has broken out of the digital cube, woe to all Aliens!");
return;
}

animateBackgroundColor();
showAlert(`${coreCapabilities[index].name} has been restored by 20%!`);
// Add a console.log to debug the bits value
console.log("Updated bits value:", bits);
// Update the bits display in the HTML file
setTimeout(() => {
  document.getElementById("bits-value").innerText = bits;
}, 100); // 100ms delay// Remove visual effect from the cube to indicate restoration (e.g., revert color)
updateCubeColor();
updateCapabilityLegend();
} else {
    animateBackgroundColor();
    showAlert("Not enough bits to restore the capability!");
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

function animateBackgroundColor() {
  const bgAnimation = document.querySelector(".bg-animation");
  const initialBackgroundColor = getComputedStyle(bgAnimation).backgroundColor;
  bgAnimation.style.backgroundColor = "rgba(51, 51, 51, 0.5)";

  setTimeout(() => {
    bgAnimation.style.backgroundColor = initialBackgroundColor;
  }, 3000); // Reset the background color after 3 seconds
}

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