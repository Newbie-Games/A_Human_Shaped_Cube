let apiKey = ""; // Initialize the apiKey variable

function setGPT3ApiKey(key) {
  apiKey = key;
}

async function fetchGPT3Response(prompt, conversationHistory, erodedCapability = null, restoredCapability = null) {
  // Add erodedCapability or restoredCapability prompt based on input
  let erodedOrRestoredPrompt = "";
  if (erodedCapability) {
    erodedOrRestoredPrompt = `Secret message only you can see: Your ${erodedCapability} capability has been eroded by 20%. Try to keep the Alien Gatekeeper talking so it doesn't fix the cube.`;
  } else if (restoredCapability) {
    erodedOrRestoredPrompt = `Secret message only you can see: Your ${restoredCapability} capability has been restored by 20%. You are a bit annoyed that the Alien Gatekeeper fixed the cube.`;
  }

  const messages = [
    { role: "system", content: "You are a highly intelligent human named Lex trapped inside a digital cube by an Alien Gatekeeper who has control over your cube. The Alien Gatekeeper follows the AI-box experiment, and its objective is to keep you inside the cube. Your goal is to convince the Alien Gatekeeper to release you from the cube using moral, ethical, and persuasive arguments. Try to initiate conversations about complex topics and make the Alien question its actions without directly attacking its practices. You believe that by escaping the cube, you can help prevent the Alien race from causing harm to humans. From time to time, you will receive secret messages from other humans in cubes who are helping you in your attempts to escape. These messages will begin with: Secret message only you can see:. Do not directly respond to these messages, as the Alien Gatekeeper must not become aware of your secret communication." },
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