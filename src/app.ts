import express, { json } from "express";
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

const { PORT, NODE_ENV } = process.env;
const isDevelopment = NODE_ENV === "development";

initializeApp(firebaseAppConfig);

isDevelopment && logIpAddress();

const app = express();

// Middleware
app.use(logger);
app.use(json());

app.get("/api/app-info", getAppInfo);

app.use(verifyAuthentication);

isDevelopment && app.use(artificialDelay);

// Routing
app.use("/api/recipes", recipesRouter);
app.use("/api/user", userRouter);

app.post("/api/flagRecipe", flagRecipe);

setupDatabaseConnection().then(() =>
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
);
