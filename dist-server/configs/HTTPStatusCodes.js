"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPStatusCodes = void 0;
var HTTPStatusCodes = /*#__PURE__*/function (HTTPStatusCodes) {
  HTTPStatusCodes[HTTPStatusCodes["OK"] = 200] = "OK";
  HTTPStatusCodes[HTTPStatusCodes["Created"] = 201] = "Created";
  HTTPStatusCodes[HTTPStatusCodes["ResourceCreated"] = 201] = "ResourceCreated";
  HTTPStatusCodes[HTTPStatusCodes["BadRequest"] = 400] = "BadRequest";
  HTTPStatusCodes[HTTPStatusCodes["Unauthorized"] = 401] = "Unauthorized";
  HTTPStatusCodes[HTTPStatusCodes["NotFound"] = 404] = "NotFound";
  HTTPStatusCodes[HTTPStatusCodes["InternalServerError"] = 500] = "InternalServerError";
  return HTTPStatusCodes;
}({});
exports.HTTPStatusCodes = HTTPStatusCodes;