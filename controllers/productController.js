const productModel = require("../schema/productSchema");
const fs = require("fs");

const addProductImg = async (req, res, next) => {
  const { name, pno, details, method, img } = req.body;
  // console.log("Body", req.body);
  // console.log("Body", req.body, "img file", req.files, req.files.img);
  // console.log("Uploaded file", req.file);
  try {
    const existingProd = await productModel.findOne({ pno: pno });
    if (existingProd) {
      // if (req.file) {
      //   fs.unlinkSync(req.file.path);
      // }

      return res.status(422).json({ error: "Product already exists" });
    }
    if (method !== "qr" && method !== "bc") {
      // if (req.file) {
      //   fs.unlinkSync(req.file.path);
      // }

      return res.status(422).json({ error: "Method is not QR or Barcode" });
    }
    var final_img;
    // req.files.find((obj) => {
    // var encode_img = req.files.img.toString("base64");
    // console.log("Object", obj);
    // console.log("Name", obj.originalname.split(".")[0]);
    // final_img = req.files.img;
    // });
    // var img = fs.readFileSync(req.file.path);
    // console.log("Image", img);
    var encode_img = img.toString("base64");
    var final_img = {
      contentType: img,
      image: (encode_img, "base64"),
    };
    console.log("Final img", final_img);
    const result = await productModel.create({
      name: name,
      pno: pno,
      details: details,
      method: method,
      img: final_img,
    });
    const newProd = await productModel.findOne({ pno: pno });
    res.status(200).json({
      msg: "Product added successfully",
      data: newProd,
    });
  } catch (err) {
    // if (req.file) {
    //   fs.unlinkSync(req.file.path);
    // }

    next(err);
  }
};
const addProduct = async (req, res, next) => {
  const { name, pno, details, method, no } = req.body;
  console.log(req.body);
  // console.log("Uploaded file", req.file);
  try {
    const existingProd = await productModel.findOne({ pno: pno });
    if (existingProd) {
      return res.status(422).json({ error: "Product already exists" });
    }
    if (method !== "bn" && method !== "sn") {
      return res
        .status(422)
        .json({ error: "Method is not Serial no or Batch no" });
    }

    const result = await productModel.create({
      name: name,
      pno: pno,
      details: details,
      method: method,
      no: no,
    });
    const newProd = await productModel.findOne({ pno: pno });
    res.status(200).json({
      msg: "Product added successfully",
      "Product Id": newProd.pid,
      img: newProd.qr,
    });
  } catch (err) {
    next(err);
  }
};

const allProducts = async (req, res, next) => {
  try {
    const products = await productModel.find({});

    return res
      .status(200)
      .json({ msg: "Products found Successfully", data: products });
  } catch (err) {
    next(err);
  }
};
const updateProduct = async (req, res, next) => {
  const { pid, name, method, details } = req.body;
  try {
    const existingProd = await productModel.findOne({ pid: pid });
    if (!existingProd) {
      try {
        const del = await fs.unlinkSync(req.file.path);
      } catch (err) {
        console.log("err", err);
      }
      return res.status(400).json({ error: "Product doesnot exists " });
    }
    if (method && method !== "qr" && method !== "bc") {
      try {
        const del = await fs.unlinkSync(req.file.path);
      } catch (err) {
        console.log("err", err);
      }
      return res.status(422).json({ msg: "Method is not QR or Barcode" });
    }
    if (existingProd.img && req.file.path) {
      try {
        await fs.unlinkSync(existingProd.img.contentType.path);
      } catch (err) {
        console.log(err);
      }
    }

    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString("base64");
    var final_img = {
      contentType: req.file,
      image: (encode_img, "base64"),
    };
    const updated = await productModel.findByIdAndUpdate(existingProd._id, {
      name: name,
      details: details,
      method: method,
      img: final_img,
      no: null,
    });

    if (updated) {
      return res.status(200).json({ msg: "Product updated successfully" });
    } else {
      return res.status(422).json({ msg: "Couldnot update product" });
    }
  } catch (err) {
    next(err);
  }
};

const updateProductDetails = async (req, res, next) => {
  const { pid, name, method, no, details } = req.body;
  // console.log("Pno", pno);
  try {
    const existingProd = await productModel.findOne({ pid: pid });
    // console.log("Existing prod", existingProd);
    if (!existingProd) {
      return res.status(400).json({ error: "Product doesnot exists" });
    }

    if (method && method !== "bn" && method !== "sn") {
      return res
        .status(422)
        .json({ msg: "Method is not Serial No or Batch No" });
    }

    const updated = await productModel.findByIdAndUpdate(existingProd._id, {
      name: name,
      details: details,
      method: method,
      no: no,
      img: null,
    });
    if (updated) {
      try {
        if (existingProd.img) {
          const del = await fs.unlinkSync(existingProd.img.contentType.path);
        }
      } catch (err) {
        console.log("err", err);
      }
      return res
        .status(200)
        .json({ msg: "Product details updated successfully" });
    } else {
      return res.status(422).json({ msg: "Couldnot update product details" });
    }
  } catch (err) {
    next(err);
  }
};
const updateSingleProduct = async (req, res, next) => {
  const { id, data } = req.body;
  console.log(req.body);
  try {
    const existingProd = await productModel.findOne({ _id: id });
    // console.log("Existing prod", existingProd);
    if (!existingProd) {
      return res.status(422).json({ msg: "Product doesnot exist" });
    }
    console.log("Existing", existingProd, data.name);
    if (existingProd.name === data.name) {
      return res.status(422).json({ msg: "Nothing to update" });
    }

    const updated = productModel.findByIdAndUpdate(id, data);
    // console.log("Updated", updated);
    if (updated) {
      return res.status(200).json({ msg: "Product updated successfully" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  const { pid } = req.body;
  try {
    const existingProd = await productModel.findOne({ pid: pid });
    if (!existingProd) {
      return res.status(400).json({ error: "Product doesnot exist" });
    }
    const deleted = await productModel.findByIdAndDelete(existingProd._id);
    const deletedProd = await productModel.findOne({ pid: pid });

    if (!deletedProd) {
      try {
        const del = await fs.unlinkSync(existingProd.img.contentType.path);
      } catch (err) {
        console.log("err", err);
      }

      // if (del === undefined) {
      //   console.log(del);
      //   return res.status(200).json({ msg: "Product deleted successfully" });
      // } else {
      return res.status(200).json({
        msg: "Product deleted successfully",
        qr: "QR Image not found or deleted",
      });
      // }
    } else {
      return res.status(422).json({ msg: "Couldnot delete product" });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addProduct,
  addProductImg,
  deleteProduct,
  allProducts,
  updateProduct,
  updateProductDetails,
};
