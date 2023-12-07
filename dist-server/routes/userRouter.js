"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("../controllers/userController");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
router.get('/', _userController.getUserData);
router["delete"]('/', _userController.deleteUserData);
router.patch('/', _userController.updateUserData);
var _default = router;
exports["default"] = _default;