var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addLocation,
  updateBusinessLocation,
  allLocationTags,
  addLocationAssets,
  deleteLocationTag,
  removeLocationAssets,
  removeAllLocationAssets,
  getExcelTemplate,
} = require("../controllers/locController");

router.get("/location", function (req, res, next) {
  res.send("Location");
});
router.get("/allLocationtags", allLocationTags);
router.get("/getExcelTemplate", getExcelTemplate);

router.post("/addLocation", addLocation);
router.post("/addLocationAssets", addLocationAssets);
router.post("/updateBusinessLocation", updateBusinessLocation);
router.post("/deleteLocation", deleteLocationTag);
router.post("/removeLocationAssets", removeLocationAssets);
router.post("/removeAllLocationAssets", removeAllLocationAssets);

module.exports = router;
