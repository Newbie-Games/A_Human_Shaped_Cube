document.getElementById("chat-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const chatInput = document.getElementById("chat-input");
    const message = chatInput.value.trim();
    if (message) {
      displayMessage(message, "player");
      conversationHistory.push({ role: "user", content: message }); // Add the player's message to the conversation history
      chatInput.value = "";
      const response = await fetchGPT3Response(message, conversationHistory);
      displayMessage(response, "human");
      conversationHistory.push({ role: "assistant", content: response }); // Add the AI's response to the conversation history
    }
  });
    
  function displayMessage(message, sender) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message chat-message-${sender}`;
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Add an event listener for the chat-input field to stop event propagation
  document.getElementById("chat-input").addEventListener("mousedown", (event) => {
    event.stopPropagation();
  }, false);