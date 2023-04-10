let responseTimeout = null;

function startResponseTimer() {
  if (responseTimeout) {
    clearTimeout(responseTimeout);
  }

  responseTimeout = setTimeout(() => {
    erodeCapability();
    showAlert("A cube has been eroded because you did not respond to the message in time.");
  }, 30000); // 30 seconds
}

function stopResponseTimer() {
  if (responseTimeout) {
    clearTimeout(responseTimeout);
    responseTimeout = null;
  }
}