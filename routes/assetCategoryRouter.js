var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addAssetCategory,
  allAssetCategory,
  addAssetMethod,
  updateAssetMethod,
  deleteAssetMethod,
  updateAssetCategory,
  addAssetTemplate,
  updateAssetTemplate,
  deleteAssetCategory,
  deleteAssetTemplate,
} = require("../controllers/assetCategoryController");

router.post("/addAssetCategory", addAssetCategory);
router.get("/allAssetCategory", allAssetCategory);
router.post("/updateAssetCategory", updateAssetCategory);
router.post("/addAssetMethod", addAssetMethod);
router.post("/updateAssetMethod", updateAssetMethod);
router.post("/deleteAssetMethod", deleteAssetMethod);
router.post("/addAssetTemplate", addAssetTemplate);
router.post("/updateAssetTemplate", updateAssetTemplate);
router.post("/deleteAssetCategory", deleteAssetCategory);
router.post("/deleteAssetTemplate", deleteAssetTemplate);

module.exports = router;
