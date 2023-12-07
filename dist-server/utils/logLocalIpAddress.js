"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logIpAddress = void 0;
var _os = _interopRequireDefault(require("os"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var logIpAddress = function logIpAddress() {
  var networkInterfaces = _os["default"].networkInterfaces();
  var networkInfo = networkInterfaces['en0'];
  if (!networkInfo || networkInfo.length < 1) return;
  console.log('Local IP address: ', networkInfo[1].address);
};
exports.logIpAddress = logIpAddress;