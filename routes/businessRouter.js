var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addBusinessType,
  allBusinessTypes,
  updateBusinessType,
  addBusinessMethod,
  updateBusinessMethod,
  allBusinessMethods,
  deleteBusinessMethod,
  addBusinessTemplate,
  updateBusinessTemplate,
  deleteBusinessType,
  deleteBusinessTemplate,
} = require("../controllers/businessController");

router.post("/addBusinessType", addBusinessType);
router.get("/allBusinessTypes", allBusinessTypes);
router.post("/updateBusinessType", updateBusinessType);
router.post("/addBusinessMethod", addBusinessMethod);
router.post("/updateBusinessMethod", updateBusinessMethod);
router.post("/addBusinessTemplate", addBusinessTemplate);
router.post("/updateBusinessTemplate", updateBusinessTemplate);
router.get("/allBusinessMethods", allBusinessMethods);
router.post("/deleteBusinessMethod", deleteBusinessMethod);
router.post("/deleteBusinessType", deleteBusinessType);
router.post("/deleteBusinessTemplate", deleteBusinessTemplate);

module.exports = router;
