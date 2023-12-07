"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _express = _interopRequireWildcard(require("express"));
require("dotenv/config");
var _setupDatabaseConnection = require("./utils/setupDatabaseConnection");
var _logger = require("./middlewares/logger");
var _verifyAuthentication = require("./middlewares/verifyAuthentication");
var _ratingsRouter = _interopRequireDefault(require("./routes/ratingsRouter"));
var _recipesRouter = _interopRequireDefault(require("./routes/recipesRouter"));
var _userRouter = _interopRequireDefault(require("./routes/userRouter"));
var _firebase = require("./configs/firebase");
var _app = require("firebase-admin/app");
var _logLocalIpAddress = require("./utils/logLocalIpAddress");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// import { artificialDelay } from './middlewares/artificialDelay';

var PORT = process.env.PORT;
(0, _setupDatabaseConnection.setupDatabaseConnection)();
(0, _app.initializeApp)(_firebase.firebaseAppConfig);
(0, _logLocalIpAddress.logIpAddress)();
var app = (0, _express["default"])();

// Middleware
app.use((0, _express.json)());
app.use(_logger.logger);
// app.use(artificialDelay);
app.use(_verifyAuthentication.verifyAuthentication);

// Routing
app.use('/api/ratings', _ratingsRouter["default"]);
app.use('/api/recipes', _recipesRouter["default"]);
app.use('/api/user', _userRouter["default"]);
app.listen(PORT, function () {
  return console.log("Listening on port ".concat(PORT));
});