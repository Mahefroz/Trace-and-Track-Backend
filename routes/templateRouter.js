var express = require("express");
var multer = require("multer");
var router = express.Router();

const {
  addTemplate,
  allTemplates,
  updateTemplate,
  updateTemplateDetails,
  getSingleTemplate,
  deleteSingleTemplate,
} = require("../controllers/templateController");
router.post("/addTemplate", addTemplate);
router.post("/updateTemplate", updateTemplate);
router.post("/updateTemplateDetails", updateTemplateDetails);
router.get("/allTemplates", allTemplates);
router.post("/getSingleTemplate", getSingleTemplate);
router.post("/deleteSingleTemplate", deleteSingleTemplate);

module.exports = router;
