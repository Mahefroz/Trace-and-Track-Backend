var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addAssetDetail,
  allAssetDetails,
} = require("../controllers/assetDetailController");

router.post("/addAssetDetail", addAssetDetail);
router.get("/allAssetDetails", allAssetDetails);

module.exports = router;
