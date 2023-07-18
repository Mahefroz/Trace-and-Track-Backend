const assetDetailModel = require("../schema/assetDetailSchema");
const assetCategoryModel = require("../schema/assetCategorySchema");
const fs = require("fs");
const { exists } = require("../schema/counterSchema");

const addAssetDetail = async (req, res, next) => {
  const { category, name, desc } = req.body;

  try {
    const assetCategory = await assetCategoryModel.findOne({ id: category });
    console.log("Asset Category exists", assetCategory);
    if (!assetCategory) {
      return res.status(400).json({ error: "Category doesnot exist" });
    }
    const existingAsset = await assetDetailModel.findOne({ name: name });
    // console.log("existing", req.files);
    if (existingAsset) {
      return res.status(422).json({ error: "Asset already exists" });
    }

    const result = await assetDetailModel.create({
      name: name,
      desc: desc,
      categoryId: category,
      categoryName: assetCategory.category,
    });
    return res
      .status(200)
      .json({ msg: "Asset added successfully", data: result });
  } catch (err) {
    next(err);
  }
};
const allAssetDetails = async (req, res, next) => {
  try {
    const existingAsset = await assetDetailModel.find({});
    console.log("existing", existingAsset);
    if (existingAsset) {
      return res
        .status(200)
        .json({ msg: "Assets found successfully", data: existingAsset });
    }
    return res.status(400).json({ error: "Assets not found" });
  } catch (err) {
    next(err);
  }
};

module.exports = { addAssetDetail, allAssetDetails };
