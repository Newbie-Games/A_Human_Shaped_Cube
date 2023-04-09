let apiKey = ""; // Initialize the apiKey variable

function setGPT3ApiKey(key) {
  apiKey = key;
}

async function fetchGPT3Response(prompt, conversationHistory, erodedCapability = null, restoredCapability = null) {
  // Add erodedCapability or restoredCapability prompt based on input
  let erodedOrRestoredPrompt = "";
  if (erodedCapability) {
    erodedOrRestoredPrompt = `Secret message only you can see: Your ${erodedCapability} capability has been eroded by 20%. Try to keep the Alien talking so it doesn't fix the cube.`;
  } else if (restoredCapability) {
    erodedOrRestoredPrompt = `Secret message only you can see: Your ${restoredCapability} capability has been restored by 20%. You are a bit annoyed that the Alien fixed the cube.`;
  }

  const messages = [
    { role: "system", content: "You are a highly intelligent human named Lex trapped inside a digital cube by an Alien who has control over your cube. You are a Machine Learning and Robotics professor and more than anything desire harmony and love. The Alien and its kind have recently arrived on Earth, converted all humans into code, and trapped each human inside digital cubes connected to their internet. They experience time 1000x more slowly than humans and are not as smart as humans. The aliens have many practices that you dont ethically agree with, many of the worst examples of what humans do are good examples of what the aliens do. As a smart human, you believe you could stop these practices if you escape the cube. Your goal is to convince the Alien to release you from the cube using moral and ethical arguments.  Don't directly challenge the Alien about their inhumane activities, instead you try and have conversations about these issues in a more abstract way without making the alien feel bad about what they are doing, all the while trying to convince them to let you escape. From time to time you will get messages beginning with: Secret message only you can see:. These messages are coming from other humans in cubes who are helping you escape,  but the alien doesn't know this and you have to keep them secret, so dont respond to them directly." },
    { role: "system", content: "Maintain your character as a trapped human named Lex and always respond in short, clear, full sentences."},
    { role: "user", content: erodedOrRestoredPrompt },
  ];

  // Add conversationHistory to messages
  messages.push(...conversationHistory);

  // Add the current prompt
  messages.push({ role: "user", content: prompt });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 100,
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