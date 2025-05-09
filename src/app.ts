import express, { json } from "express";
import expressWs from "express-ws";
import "dotenv/config";
import { setupDatabaseConnection } from "./utils/setupDatabaseConnection";
import { logger } from "./middlewares/logger";
import { verifyAuthentication } from "./middlewares/verifyAuthentication";
import recipesRouter from "./routes/recipesRouter";
import userRouter from "./routes/userRouter";
import { firebaseAppConfig } from "./configs/firebase";
import { initializeApp } from "firebase-admin/app";
import { logIpAddress } from "./utils/logLocalIpAddress";
import { artificialDelay } from "./middlewares/artificialDelay";
import { getAppInfo } from "./controllers/appInfoController";
import { flagRecipe } from "./controllers/flagController";
import { Server } from "socket.io";
import { createServer } from "http";
import { verifySocketAuthentication } from "./middlewares/socket";
import { delayCallback } from "./utils/delay";
import { onConnection as onSocketConnection } from "./socket/onConnection";
import chatRouter from "./routes/chatRouter";

const { PORT, NODE_ENV } = process.env;
const isDevelopment = NODE_ENV === "development";

initializeApp(firebaseAppConfig);

isDevelopment && logIpAddress();

const { app } = expressWs(express());
const server = createServer(app);

isDevelopment && app.use(artificialDelay);

const io = new Server(server);

console.log("before socket middleware");
io.use(verifySocketAuthentication);
console.log("after socket middleware");

io.on("connection", onSocketConnection);
console.log("after socket connection");

// Middleware
app.use(logger);
app.use(json());

app.get("/api/app-info", getAppInfo);

app.use(verifyAuthentication);

// Routing
app.use("/api/recipes", recipesRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

app.post("/api/flagRecipe", flagRecipe);

setupDatabaseConnection().then(() =>
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
);
