import { RequestHandler } from "express";

const secondsOfDelay = 2;

export const artificialDelay: RequestHandler = (req, res, next) => {
  console.log("Adding", secondsOfDelay, "seconds of artificial delay");
  setTimeout(() => {
    next();
  }, secondsOfDelay * 1000);
};
