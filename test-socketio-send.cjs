const { io } = require("socket.io-client");

// Replace with your backend Socket.IO URL
const socket = io("http://localhost:5001");

// Replace with real values from your database
const conversationId = "6866f67bcb47c50fa1f84a24";
const userId = "6866f67bcb47c50fa1f849cc";
// Intentionally leave receiver empty to trigger the backend validation error
const receiver = ""; // <-- Intentionally blank to reproduce error

socket.on("connect", () => {
  console.log("Connected to Socket.IO server!");
  socket.emit("join_conversation", { conversationId });

  // Check that receiver is present and not empty
  if (!receiver) {
    // This will trigger the backend error for missing receiver
    // Continue to send the message to see the error response
  }

  // Construct the message object with required fields
  const message = {
    content: "Hello from test script!",
    sender: userId,
    receiver: receiver, // receiver is required by backend schema, but left blank to trigger error
    timestamp: new Date().toISOString(),
    read: false
  };

  // Send the message and handle the response
  socket.emit("send_message", { conversationId, message }, (response) => {
    if (response && response.error) {
      // Print only the error message as in the prompt
      console.error("Send message error:", response.error);
    } else {
      // Print only the response as in the prompt
      console.log("Send message response:", response);
    }
    // Always disconnect the socket before exiting
    socket.disconnect();
    process.exit();
  });
});

socket.on("connect_error", (err) => {
  console.error("Socket.IO connection error:", err);
  process.exit(1);
});