var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addSingleCategory,
  allCategories,
  addCategoryMethod,
  updateCategoryMethod,
  addCategoryTemplate,
  updateCategoryTemplate,
  allCategoryMethods,
  deleteSingleCategory,
  updateSingleCategory,
  deleteCategoryMethod,
  deleteCategoryTemplate,
} = require("../controllers/categoryController");

router.post("/addCategory", addSingleCategory);
router.get("/allCategories", allCategories);
router.post("/addCategoryMethod", addCategoryMethod);
router.post("/updateCategoryMethod", updateCategoryMethod);
router.post("/addCategoryTemplate", addCategoryTemplate);
router.post("/updateCategoryTemplate", updateCategoryTemplate);
router.get("/allCategoryMethods", allCategoryMethods);
router.post("/deleteSingleCategory", deleteSingleCategory);
router.post("/updateSingleCategory", updateSingleCategory);
router.post("/deleteCategoryMethod", deleteCategoryMethod);
router.post("/deleteCategoryTemplate", deleteCategoryTemplate);

module.exports = router;
