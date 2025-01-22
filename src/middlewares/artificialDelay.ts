import { RequestHandler } from "express";
import { delayCallback } from "../utils/delay";

const secondsOfDelay = 2;

export const artificialDelay: RequestHandler = (req, res, next) => {
  console.log("Adding", secondsOfDelay, "seconds of artificial delay");
  delayCallback(() => next(), secondsOfDelay * 1000);
};
