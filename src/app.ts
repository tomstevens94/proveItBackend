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
import { sendOpenAiMessage } from "./controllers/aiController";
import { Server } from "socket.io";
import { createServer } from "http";
import { verifySocketAuthentication } from "./middlewares/socket";
import { delayCallback } from "./utils/delay";

const { PORT, NODE_ENV } = process.env;
const isDevelopment = NODE_ENV === "development";

initializeApp(firebaseAppConfig);

isDevelopment && logIpAddress();

const { app } = expressWs(express());
const server = createServer(app);

isDevelopment && app.use(artificialDelay);

const io = new Server(server);

io.use((_, next) => delayCallback(() => next(), 1000));
io.use(verifySocketAuthentication);

io.on("error", (e) => {
  console.log(`Error within socket: ${e}`);
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;

  if (typeof userId === "string") {
    socket.join(userId);

    socket.on("message", async (payload) => {
      try {
        const response = await sendOpenAiMessage(payload.content);
        const responseContent = response?.choices[0]?.message?.content;

        socket.send(responseContent);
      } catch (err) {
        console.log(err);
      }
    });
  } else {
    console.log("unable to join room");
  }
});

io.on("disconnect", (socket) => {});

// Middleware
app.use(logger);
app.use(json());

app.get("/api/app-info", getAppInfo);

app.use(verifyAuthentication);

// Routing
app.use("/api/recipes", recipesRouter);
app.use("/api/user", userRouter);

app.post("/api/flagRecipe", flagRecipe);

setupDatabaseConnection().then(() =>
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
);
