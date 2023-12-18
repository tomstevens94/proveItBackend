import { RequestHandler } from "express";

export const logger: RequestHandler = (req, res, next) => {
  const now = new Date();
  console.log(
    req.method,
    "request for endpoint:",
    req.originalUrl,
    "recieved at:",
    now
  );
  next();
};
