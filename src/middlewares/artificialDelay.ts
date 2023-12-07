import { RequestHandler } from 'express';

const secondsOfDelay = 2;

export const artificialDelay: RequestHandler = (req, res, next) => {
  setTimeout(() => {
    next();
  }, secondsOfDelay * 1000);
};
