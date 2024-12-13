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
import aiRouter from "./routes/aiRouter";
import { sendOpenAiMessage } from "./controllers/aiController";

const { PORT, NODE_ENV } = process.env;
const isDevelopment = NODE_ENV === "development";

initializeApp(firebaseAppConfig);

isDevelopment && logIpAddress();

const { app } = expressWs(express());

isDevelopment && app.use(artificialDelay);

// TODO: WebSocket Authentication
app.ws("/ai", (ws, req) => {
  ws.send(JSON.stringify({ status: "open" }));

  ws.on("message", async (message) => {
    console.log("Message received", message);
    setTimeout(() => {
      ws.send(
        JSON.stringify({
          messageStatus: "receiptConfirmed",
          payload: JSON.stringify(message),
        }),
        (err) => err && console.log("Error sending confirmation")
      );
    }, 5000);
    const openAiResponse = await sendOpenAiMessage(message.toString());

    const payload = JSON.stringify(openAiResponse?.choices[0].message);
    console.log("payload", payload);

    ws.send(payload, (err) => err && console.log("ERR?", err));
  });
  ws.on("error", (err) => err && console.log("Error in socket", err));
  ws.on("close", () => {
    console.log("Socket closed");
    ws.send(JSON.stringify({ status: "closed" }));
  });
});

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
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
);
