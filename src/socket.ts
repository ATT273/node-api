import { Server } from "socket.io";

// Biến global để lưu io instance
let io: Server;

// Function để set io instance
export const setIO = (ioInstance: Server) => {
  io = ioInstance;
};

// Function để get io instance
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};
