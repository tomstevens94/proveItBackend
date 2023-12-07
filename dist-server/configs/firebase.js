"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firebaseAppConfig = void 0;
require("dotenv/config");
var _firebaseAdmin = require("firebase-admin");
var _process$env = process.env,
  FIREBASE_PROJECT_ID = _process$env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY = _process$env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL = _process$env.FIREBASE_CLIENT_EMAIL;
var firebaseServiceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  privateKey: FIREBASE_PRIVATE_KEY,
  clientEmail: FIREBASE_CLIENT_EMAIL
};
var firebaseAppConfig = {
  credential: _firebaseAdmin.credential.cert(firebaseServiceAccount),
  projectId: FIREBASE_PROJECT_ID
};
exports.firebaseAppConfig = firebaseAppConfig;