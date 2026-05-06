import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifysocket = (socket, next) => {
  try {
    // get token from client
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    // verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // attach user data to socket
    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
};