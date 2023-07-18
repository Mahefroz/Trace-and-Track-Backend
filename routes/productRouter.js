var express = require("express");
var multer = require("multer");
var router = express.Router();

const {
  addProduct,
  addProductImg,
  deleteProduct,
  allProducts,
  updateProduct,
  updateProductDetails,
} = require("../controllers/productController");

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
var uploadDir = process.cwd() + "/uploads/products";
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
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error("file is not allowed"));
    }

    cb(null, true);
  },
});

const upload = multer({ storage: Storage });

router.get("/products", function (req, res, next) {
  res.send("Register");
});
router.get("/allproducts", allProducts);
router.get("/upload", function (req, res, next) {
  res.send("Upload imag");
});

router.post("/addProductImg", upload.any(), addProductImg);
router.post("/addProduct", addProduct);
router.post("/updateProduct", upload.single("img"), updateProduct);
router.post("/updateProductDetails", updateProductDetails);
router.post("/delProduct", deleteProduct);

// router.post('/upload', upload.single('img') , (req, res) =>{
//  try {
//   console.log("Uploaded file",req)
// //  res.send(req.files);
//  } catch(error) {
//  console.log(error);
//  res.send(400);
//  }
// });
// router.post("/upload",Middleware("file"), uploadImg);

// router.get("/signin", signin);

module.exports = router;
