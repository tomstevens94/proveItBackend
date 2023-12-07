"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = void 0;
var logger = function logger(req, res, next) {
  var now = new Date();
  console.log(req.method, 'request for endpoint: ', req.originalUrl, 'recieved at: ', now);
  next();
};
exports.logger = logger;