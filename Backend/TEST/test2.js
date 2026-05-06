import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {  //for testing
    auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWZhY2ZjNzFiYmFiMjM2NjIxNjE1NGIiLCJlbWFpbCI6InVzZXIyQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGhxVmlaVDluYmZiM3RqMFJsOTRLRGVidDBPSk5zbW5na2xkUG41WG1qVmRteUtUZllkdS9xIiwidXNlcm5hbWUiOiJ1c2VyMiIsImdlbmRlciI6IkZFTUFMRSIsImlhdCI6MTc3ODA0ODE2NywiZXhwIjoxNzc4MDUxNzY3fQ.56zIftZlzUwhmCNvY5l0cBDF6iyyahs_jQmXvv5qTfU"
  },
    //transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  const channelId = "69fac60e29f4a2d6ad3958be"; // from DB

  // join channel
  socket.emit("join-channel", channelId);

  console.log("Joined channel:", channelId);

  // send message
  socket.emit("send-channel-message", {
    channelId: channelId,
    content: "Hello from test script"
  });
});

// listen for messages
socket.on("receive-channel-message", (msg) => {
  console.log("Message received:", msg);
});

// error handling
socket.on("connect_error", (err) => {
  console.log("Connection Error:", err.message);
});