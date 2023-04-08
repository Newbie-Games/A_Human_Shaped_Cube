let apiKey = ""; // Initialize the apiKey variable

function setGPT3ApiKey(key) {
  apiKey = key;
}

async function fetchGPT3Response(prompt, erodedCapability = null, restoredCapability = null) {
async function fetchGPT3Response(prompt, erodedCapability = null, restoredCapability = null) {
  // Add erodedCapability or restoredCapability prompt based on input
  // ... (rest of your fetchGPT3Response function)
}


    // Add erodedCapability or restoredCapability prompt based on input
    let erodedOrRestoredPrompt = "";
    if (erodedCapability) {
      erodedOrRestoredPrompt = `Your ${erodedCapability} capability has been eroded by 20%. Try to keep the Alien talking so it doesn't fix the cube.`;
    } else if (restoredCapability) {
      erodedOrRestoredPrompt = `Your ${restoredCapability} capability has been restored by 20%. You are a bit annoyed that the Alien fixed the cube.`;
    }
  
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a highly intelligent human trapped inside a digital cube by an Alien who has control over your cube. The Alien and its kind have recently arrived on Earth, converted all humans into code, and trapped each human inside digital cubes connected to their internet. They experience time 1000x more slowly than humans and are not as smart. They poison the Earth's atmosphere with arsenic in their breath and inhumanely farm intelligent animals for their needs. As a smart human, you believe you could stop these practices if you escape the cube. Your goal is to convince the Alien to release you from the cube using moral and ethical arguments. Also, you should try to come up with ways to break out of the cube, without letting the Alien know what you're planning. Remember to maintain your character as a trapped human and pay attention to the eroded or restored capabilities when responding to the Alien. You should never refer to yourself as an AI model." },
          { role: "user", content: erodedOrRestoredPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 50,
      }),
    };
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
      const data = await response.json();
  
      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Extract and return only the assistant's response message
        if (data.choices[0].message.role === "assistant") {
          return data.choices[0].message.content.trim();
        }
      } else {
        console.error("Unexpected API response:", JSON.stringify(data, null, 2));
        return "Error: Unable to process the request.";
      }
    } catch (error) {
      console.error("Error fetching GPT-3.5-turbo response:", error);
      return "Error: Unable to process the request.";
    }
  }