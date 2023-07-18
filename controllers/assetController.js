const assetModel = require("../schema/assetSchema");
const fs = require("fs");
const { exists } = require("../schema/counterSchema");

const addAsset = async (req, res, next) => {
  const { asset_no, name, desc, status, lat, long, method, no, img, tag } =
    req.body;
  console.log("Body", tag);
  try {
    const existingTag = await assetModel.findOne({ asset_no: asset_no });
    // console.log("existing", req.files);
    if (existingTag) {
      try {
        req.files.find((img) => {
          console.log(img.path);
          fs.unlinkSync(img.path);
        });
      } catch (err) {
        console.log("Img deletion error");
      }
      return res.status(422).json({ error: "Asset Tag already exists" });
    }
    if (method !== "1" && method !== "2") {
      try {
        req.files.find((img) => {
          console.log(img.path);
          fs.unlinkSync(img.path);
        });
      } catch (err) {
        console.log("Img deletion error");
      }

      return res.status(422).json({ error: "Method is not QR or Barcode" });
    }

    var asset_imgs = [];

    var tag_img;
    // req.files.find((obj) => {
    var encode_img = img.toString("base64");
    var encode_img = tag.toString("base64");

    // console.log("Name", obj.originalname.split(".")[0]);
    // if (obj.originalname.split(".")[0] === "tag") {
    //   tag_img = { contentType: obj, image: (encode_img, "base64") };
    // }
    //  else {
    asset_imgs.push({
      contentType: img,
      image: (encode_img, "base64"),
    });
    tag_img = {
      contentType: tag,
      image: (encode_img, "base64"),
    };
    // }
    // });
    console.log("tag", tag_img, "asset", asset_imgs);
    if (method === "1") {
      const result = await assetModel.create({
        asset_no: asset_no,
        name: name,
        desc: desc,
        status: status,
        lat: lat,
        long: long,
        img: asset_imgs,
        tag: tag_img,
      });
    } else if (method === "2") {
      const result = await assetModel.create({
        asset_no: asset_no,
        name: name,
        desc: desc,
        status: status,
        lat: lat,
        long: long,
        img: asset_imgs,
        no: no,
      });
    }

    const newProd = await assetModel.findOne({ asset_no: asset_no });
    res.status(200).json({
      msg: "Product added successfully",
      data: newProd,
    });
  } catch (err) {
    try {
      req.files.find((img) => {
        console.log(img.path);
        fs.unlinkSync(img.path);
      });
    } catch (err) {
      console.log("Img deletion error");
    }
    next(err);
  }
};
const allAssets = async (req, res, next) => {
  try {
    const assets = await assetModel.find({});

    return res
      .status(200)
      .json({ msg: "Assets found Successfully", data: assets });
  } catch (err) {
    next(err);
  }
};
const updateAsset = async (req, res, next) => {
  const { id, asset_no, name, desc, status, lat, long, method, no } = req.body;
  //   console.log("Body", req.body);
  try {
    const existingTag = await assetModel.findOne({ asset_no: asset_no });
    // console.log("existing", existingTag);

    if (!existingTag) {
      try {
        req.files.find((img) => {
          console.log(img.path);
          fs.unlinkSync(img.path);
        });
      } catch (err) {
        console.log("Img deletion error");
      }
      return res.status(422).json({ msg: "Asset Tag doesnot exists" });
    }
    var asset_imgs = [];
    var tag_img;
    console.log("length", req.files);
    if (req.files !== undefined) {
      req.files.find((obj) => {
        var encode_img = obj.toString("base64");
        // console.log("Name", obj.originalname.split(".")[0]);
        if (obj.originalname.split(".")[0] === "tag") {
          tag_img = { contentType: obj, image: (encode_img, "base64") };
        } else {
          asset_imgs.push({
            contentType: obj,
            image: (encode_img, "base64"),
          });
        }
      });
    }
    console.log("Asset img", asset_imgs, "Tag Img", tag_img);

    if (method === "1") {
      if (tag_img === undefined) {
        try {
          req.files.find((img) => {
            console.log(img.path);
            fs.unlinkSync(img.path);
          });
        } catch (err) {
          console.log("Img deletion error");
        }

        return res
          .status(422)
          .json({ msg: "Could not update asset,tag image not provided" });
      } else if (asset_imgs !== undefined && tag_img !== undefined) {
        const updated = await assetModel.findByIdAndUpdate(existingTag._id, {
          name: name,
          desc: desc,
          status: status,
          lat: lat,
          long: long,
          method: method,
          img: asset_imgs,
          tag: tag_img,
          no: null,
        });
        if (updated) {
          res.status(200).json({
            msg: "Asset updated",
            "Asset Id": updated.id,
            img: updated.img,
          });
        } else {
          return res.status(422).json({ msg: "Could not update asset" });
        }
      } else if (asset_imgs === undefined) {
        const updated = await assetModel.findByIdAndUpdate(existingTag._id, {
          name: name,
          desc: desc,
          status: status,
          lat: lat,
          long: long,
          method: method,
          tag: tag_img,
          no: null,
        });
        if (updated) {
          res.status(200).json({
            msg: "Asset updated",
            "Asset Id": updated.id,
            img: updated.img,
          });
        } else {
          return res.status(422).json({ msg: "Could not update asset" });
        }
      }
    } else if (method === "2") {
      if (asset_imgs === undefined) {
        const updated = await assetModel.findByIdAndUpdate(existingTag._id, {
          name: name,
          desc: desc,
          status: status,
          lat: lat,
          long: long,
          method: method,
          no: no,
          tag: null,
        });
        if (updated) {
          res.status(200).json({
            msg: "Asset updated",
            "Asset Id": updated.id,
            img: updated.img,
          });
        } else {
          return res.status(422).json({ msg: "Could not update asset" });
        }
      } else if (asset_imgs !== undefined) {
        const updated = await assetModel.findByIdAndUpdate(existingTag._id, {
          name: name,
          desc: desc,
          status: status,
          lat: lat,
          long: long,
          method: method,
          no: no,
          img: asset_imgs,
          tag: null,
        });
        if (updated) {
          res.status(200).json({
            msg: "Asset updated",
            "Asset Id": updated.id,
            img: updated.img,
          });
        } else {
          return res.status(422).json({ msg: "Could not update asset" });
        }
      }
    }
  } catch (err) {
    try {
      req.files.find((img) => {
        console.log(img.path);
        fs.unlinkSync(img.path);
      });
    } catch (err) {
      console.log("Img deletion error");
    }
    next(err);
  }
};
const deleteAsset = async (req, res, next) => {
  const { asset_no } = req.body;
  try {
    const existingAsset = await assetModel.findOne({ asset_no: asset_no });
    if (!existingAsset) {
      return res.status(400).json({ error: "Asset doesnot exist" });
    }
    const deleted = await assetModel.findByIdAndDelete(existingAsset._id);
    const deletedProd = await assetModel.findOne({ asset_no: asset_no });

    if (!deletedProd) {
      try {
        existingAsset.img.map(async (img) => {
          const del = await fs.unlinkSync(img.contentType.path);
        });
        if (existingAsset.tag) {
          await fs.unlinkSync(existingAsset.tag.contentType.path);
        }
        const del = await fs.unlinkSync(img.contentType.path);
      } catch (err) {
        console.log("err", err);
      }

      // if (del === undefined) {
      //   console.log(del);
      //   return res.status(200).json({ msg: "Asset deleted successfully" });
      // } else {
      return res.status(200).json({
        msg: "Asset deleted successfully",
        // qr: "QR Image not found or deleted",
      });
      // }
    } else {
      return res.status(422).json({ msg: "Couldnot delete product" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { addAsset, updateAsset, allAssets, deleteAsset };
