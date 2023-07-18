var express = require("express");
var multer = require("multer");
var router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  addAsset,
  updateAsset,
  allAssets,
  deleteAsset,
} = require("../controllers/assetController");

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
var uploadDir = process.cwd() + "/uploads/assets";

var images = ".jpg";
var Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("fILE", file);

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    var image = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + image);
  },
  //   fileFilter: (req, file, cb) => {
  //     if (!whitelist.includes(file.mimetype)) {
  //       return cb(new Error("file is not allowed"));
  //     }

  //     cb(null, true);
  //   },
});

const upload = multer({ storage: Storage });

router.post("/addAsset", upload.any(), addAsset);
router.post("/updateAsset", upload.any(), updateAsset);
router.get("/allAssets", allAssets);
router.post("/deleteAsset", deleteAsset);

module.exports = router;
