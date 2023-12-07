"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _recipesController = require("../controllers/recipesController");
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var storage = _multer["default"].diskStorage({
  destination: 'uploads/',
  filename: function filename(req, file, cb) {
    cb(null, "".concat(file.originalname, ".").concat(file.mimetype.split('/')[1]));
  }
});
var upload = (0, _multer["default"])({
  storage: storage
}).single('imageData');
var router = _express["default"].Router();
router.get('/', _recipesController.getAllRecipes);
router.get('/:recipeId', _recipesController.getRecipeById);
router.post('/complete', _recipesController.postRecipeIsComplete);
router.post('/new', upload, _recipesController.postNewRecipe);
var _default = router;
exports["default"] = _default;