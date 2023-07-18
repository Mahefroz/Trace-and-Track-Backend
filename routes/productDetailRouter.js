var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addProduct,
  allProducts,
  getCategoryProducts,
  deleteSingleProduct,
} = require("../controllers/productDetailController");

router.post("/addProducts", addProduct);
router.get("/allProducts", allProducts);
router.post("/getSingleProduct", getCategoryProducts);
router.post("/deleteSingleProduct", deleteSingleProduct);

module.exports = router;
