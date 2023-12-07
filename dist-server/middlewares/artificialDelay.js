"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.artificialDelay = void 0;
var secondsOfDelay = 2;
var artificialDelay = function artificialDelay(req, res, next) {
  setTimeout(function () {
    next();
  }, secondsOfDelay * 1000);
};
exports.artificialDelay = artificialDelay;