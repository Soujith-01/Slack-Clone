import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWZhY2ZjNzFiYmFiMjM2NjIxNjE1NGIiLCJlbWFpbCI6InVzZXIyQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGhxVmlaVDluYmZiM3RqMFJsOTRLRGVidDBPSk5zbW5na2xkUG41WG1qVmRteUtUZllkdS9xIiwidXNlcm5hbWUiOiJ1c2VyMiIsImdlbmRlciI6IkZFTUFMRSIsImlhdCI6MTc3ODA0ODkyMywiZXhwIjoxNzc4MDUyNTIzfQ.H2h0ZP0DEin35IdI_q5QGF8SjqGOGscSzxvTic9k540"
  }
});

//connection
socket.on("connect", () => {
  console.log("Connected:", socket.id);

  //IMPORTANT VALUES
  const receiverId = "69fac5f129f4a2d6ad3958bd";  // user2
  const chatId = "69fad97bf9cf061971a33abd";         // from DB (chatModel)

  // send DM
  socket.emit("send-dm", {
    receiverId,
    chatId,
    content: "Hello from DM test"
  });
});

//receive DM
socket.on("receive-dm", (msg) => {
  console.log("DM received:", msg);
});

//error handling
socket.on("connect_error", (err) => {
  console.log("Error:", err.message);
});