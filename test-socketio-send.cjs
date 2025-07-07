const { io } = require("socket.io-client");

const socket = io("http://localhost:5001");

const conversationId = "6866f67bcb47c50fa1f84a24";
const userId = "6866f67bcb47c50fa1f849cc";
const receiver = "";

socket.on("connect", () => {
  console.log("Connected to Socket.IO server!");
  socket.emit("join_conversation", { conversationId });

  if (!receiver) {
  }

  const message = {
    content: "Hello from test script!",
    sender: userId,
    receiver: receiver,
    timestamp: new Date().toISOString(),
    read: false
  };

  socket.emit("send_message", { conversationId, message }, (response) => {
    if (response && response.error) {
      console.error("Send message error:", response.error);
    } else {
      console.log("Send message response:", response);
    }
    socket.disconnect();
    process.exit();
  });
});

socket.on("connect_error", (err) => {
  console.error("Socket.IO connection error:", err);
  process.exit(1);
});