import express from "express";
import http from "http";
import { Server } from "socket.io";
import { CONNECT_DB, GET_DB } from "./src/config/mongodb";
import exitHook from "async-exit-hook";
import userRouter from "./src/routes/users";
import authRouter from "./src/routes/auth";
import productRouter from "./src/routes/product";
import roleRouter from "./src/routes/role";
import inventoryRouter from "./src/routes/inventory";
import dashboardRouter from "./src/routes/dashboard";
import cors from "cors";
import { setIO } from "./src/socket";

const START_SERVER = async () => {
  // await CONNECT_DB();
  const app = express();

  const host = "localhost";
  const port = 5000;
  app.use(
    cors({
      origin: "http://localhost:3000", // Allow only your frontend's origin
    }),
  );

  // middleware
  app.use(express.json());

  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/roles", roleRouter);
  app.use("/api/inventories", inventoryRouter);
  app.use("/api/dashboard", dashboardRouter);

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  setIO(io);

  io.on("connection", (socket) => {
    console.log("✅ Client connected");

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });
  });

  httpServer.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  exitHook((signal) => {
    console.log("Server is shutting down...");
  });
};

// CONNECT TO DATABASE
CONNECT_DB()
  .then(() => console.log("Connected to Mongo database"))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error("Error connecting to Mongo database", error);
    process.exit(0);
  });
