var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addCategoryData,
  getCurrentSerialNo,
  getCurrentBatchNo,
  getAllProducts,
} = require("../controllers/categoryDataController");

router.post("/addCategoryData", addCategoryData);
router.post("/getCurrentSerialNo", getCurrentSerialNo);
router.post("/getCurrentBatchNo", getCurrentBatchNo);
router.post("/getAllProducts", getAllProducts);
// router.get("/allCategories", allCategories);

module.exports = router;
