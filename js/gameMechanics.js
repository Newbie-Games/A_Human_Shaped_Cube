// Define core capabilities and their initial values
const coreCapabilities = [
    { name: "Empathy", value: 100 },
    { name: "Morality", value: 100 },
    { name: "Intellect", value: 100 },
  ];
  
  // Define the player's resource (bits)
  let bits = 1000;
  
  // Define the erodedCubes array
  window.erodedCubes = [];
  
function getRandomErosionRate() {
    // Modify the factors and probabilities based on your game balance
    const rates = [10, 20, 30];
    const probabilities = [0.5, 0.3, 0.2];
    const randomNumber = Math.random();
    let accumulatedProbability = 0;
  
    for (let i = 0; i < rates.length; i++) {
      accumulatedProbability += probabilities[i];
      if (randomNumber < accumulatedProbability) {
        return rates[i];
      }
    }
  }

// Function to randomly erode a core capability based on dynamic erosion rates
function erodeCapability() {
    console.log("erodeCapability called");
    const randomIndex = Math.floor(Math.random() * coreCapabilities.length);
    const erosionRate = getRandomErosionRate();
    coreCapabilities[randomIndex].value -= erosionRate;
    if (coreCapabilities[randomIndex].value < 0) {
      coreCapabilities[randomIndex].value = 0;
    }
    const cubeID = group.children[Math.floor(Math.random() * group.children.length)].uuid;
    erodedCubes.push({ id: cubeID, capability: coreCapabilities[randomIndex].name });
  
    // Send a message to the human in the cube
    const humanMessage = `The ${coreCapabilities[randomIndex].name} capability has been eroded by ${erosionRate}%.`;
    fetchGPT3Response(humanMessage, coreCapabilities[randomIndex].name, null).then((gpt3Response) => {
      displayMessage(gpt3Response, "human");
    });
    updateCubeColor();
    updateCapabilitiesLegend();
  
    // Add the alert here
    alert(`The ${coreCapabilities[randomIndex].name} capability has been eroded by ${erosionRate}%.`);
  }

  // Function to restore eroded capabilities by spending bits
  async function restoreCapability(index) {
    if (bits >= 100) {
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
  
      // Send a message to the human in the cube
      const humanMessage = `The ${coreCapabilities[index].name} capability has been restored by 20%.`;
      const gpt3Response = await fetchGPT3Response(humanMessage, null, coreCapabilities[index].name);
      displayMessage(gpt3Response, "human");
  
      alert(`${coreCapabilities[index].name} has been restored by 20%!`);
      // Update the bits display in the HTML file
      document.getElementById("bits-value").innerText = bits;
      // Remove visual effect from the cube to indicate restoration (e.g., revert color)
      updateCubeColor();
      updateCapabilitiesLegend();
    } else {
      alert("Not enough bits to restore the capability!");
    }
  }
  
  function initTimer() {
    setTimeout(() => {
      erodeCapability();
      initTimer();
    }, 60000); 
  }

  // Define random events and their impact
const randomEvents = [
    {
      name: "Power Outage",
      effect: () => {
        bits -= 100; // Modify bits based on the chosen event
        return "A power outage has occurred, and you've lost 100 bits!";
      },
    },
    // ... Additional events
  ];

  function triggerRandomEvent() {
    // Randomly select an event from the randomEvents array
    const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
  
    // Execute the effect of the event and get the alert message
    const alertMessage = randomEvent.effect();
  
    // Alert the player about the event
    alert(alertMessage);
  
    // Schedule the next random event
    setTimeout(triggerRandomEvent, 300000); // Adjust the interval for balance
  }

  // Update the capabilities legend
  function updateCapabilitiesLegend() {
    document.getElementById("capability-empathy-value").innerText = coreCapabilities[0].value;
    document.getElementById("capability-morality-value").innerText = coreCapabilities[1].value;
    document.getElementById("capability-intellect-value").innerText = coreCapabilities[2].value;
  }

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
        });
      } else {
        // Revert the cube color to its original color if it is not eroded
        cube.material.forEach((material, materialIndex) => {
          const originalColor = new THREE.Color(cube.userData.originalColors[materialIndex]);
          material.color.copy(originalColor);
        });
      }
    });
  }

  // Initialize the random event timer
setTimeout(triggerRandomEvent, 300000); // Example interval: 5 minutes