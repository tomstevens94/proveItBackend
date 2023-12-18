import express, { json } from "express";
import "dotenv/config";
import { setupDatabaseConnection } from "./utils/setupDatabaseConnection";
import { logger } from "./middlewares/logger";
import { verifyAuthentication } from "./middlewares/verifyAuthentication";
import ratingsRouter from "./routes/ratingsRouter";
import recipesRouter from "./routes/recipesRouter";
import userRouter from "./routes/userRouter";
import { firebaseAppConfig } from "./configs/firebase";
import { initializeApp } from "firebase-admin/app";
import { logIpAddress } from "./utils/logLocalIpAddress";
// import { artificialDelay } from './middlewares/artificialDelay';

const { PORT } = process.env;

// setupDatabaseConnection().then(() =>
// );
initializeApp(firebaseAppConfig);

if (process.env.NODE_ENV === "development") {
  logIpAddress();
}

const app = express();
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Middleware
app.use(json());
app.use(logger);
// app.use(artificialDelay);
app.use(verifyAuthentication);

// Routing
app.use("/api/ratings", ratingsRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/user", userRouter);
app.use("/api/test", (req, res) => res.sendStatus(200));
