import { io } from "socket.io-client";

export const socket = io(
  "http://localhost:3000",
  {
    withCredentials: true,
    transports: ["websocket"],
  }
);

socket.on("connect", () => {
  console.log(
    "SOCKET CONNECTED"
  );
});

socket.on(
  "connect_error",
  (err) => {
    console.log(err.message);
  }
);