const assetCategoryModel = require("../schema/assetCategorySchema");
const templateModel = require("../schema/templateSchema");
const fs = require("fs");
const { exists } = require("../schema/counterSchema");

const addAssetCategory = async (req, res, next) => {
  const { category } = req.body;
  console.log("category", category);
  try {
    const existingCategory = await assetCategoryModel.findOne({
      category: category,
    });
    if (existingCategory) {
      return res.status(422).json({ error: "Category already exists" });
    }
    const result = await assetCategoryModel.create({
      category: category,
    });
    return res
      .status(200)
      .json({ msg: "Asset Category added successfully", data: result });
  } catch (err) {
    next(err);
  }
};
const allAssetCategory = async (req, res, next) => {
  try {
    const allCategories = await assetCategoryModel.find({});
    console.log("all", allCategories);
    if (allCategories) {
      return res
        .status(200)
        .json({ msg: "Categories found successfully", data: allCategories });
    } else {
      return res.status(400).json({ error: "No Categories found" });
    }
  } catch (err) {
    next(err);
  }
};
const updateAssetCategory = async (req, res, next) => {
  const { id, newCategory } = req.body;
  console.log(req.body);
  try {
    const existingCategory = await assetCategoryModel.findOne({
      id: id,
    });
    if (!existingCategory) {
      return res
        .status(422)
        .json({ error: "Category to be updated not found" });
    }
    const sameName = await assetCategoryModel.findOne({
      category: newCategory,
    });
    console.log("Same", sameName);
    if (sameName) {
      return res
        .status(422)
        .json({ error: "Category with same name already exists" });
    }
    const updated = await assetCategoryModel.findByIdAndUpdate(
      existingCategory._id,
      {
        category: newCategory,
      }
    );
    if (updated) {
      return res.status(200).json({ msg: "Category updated successfully" });
    } else {
      return res.status(422).json({ error: "Could not update category" });
    }
  } catch (err) {
    console.log(err);
  }
};
const deleteAssetCategory = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const existingType = await assetCategoryModel.findOne({ id: categoryId });
    console.log("existing", existingType);
    if (!existingType) {
      return res.status(400).json({ error: "Business Category doesnot exist" });
    }
    const deleted = await assetCategoryModel.findByIdAndDelete(
      existingType._id
    );
    const deletedMethod = await assetCategoryModel.findOne({ id: categoryId });
    if (!deletedMethod) {
      return res.status(200).json({
        msg: "Tagging Method deleted successfully",
      });
    } else {
      return res.status(422).json({ error: "Could not delete tagging method" });
    }
  } catch (err) {
    next(err);
  }
};
const addAssetMethod = async (req, res, next) => {
  const { category, method } = req.body;
  console.log("Body", req.body);
  try {
    if (!method) {
      return res.status(422).json({ error: "Category methodnot provided" });
    }
    const existingCategory = await assetCategoryModel.findOne({
      id: category,
    });
    console.log("Existing", existingCategory);
    if (!existingCategory) {
      return res.status(400).json({ error: "Category not found" });
    }
    if (!existingCategory.method) {
      const updated = await assetCategoryModel.findByIdAndUpdate(
        existingCategory._id,
        {
          method: method,
        }
      );
      if (updated) {
        return res.status(200).json({
          msg: "Asset Tagging Method added successfully",
        });
      } else {
        return res
          .status(422)
          .json({ error: "Could not add asset tagging method" });
      }
    } else {
      return res.status(422).json({ error: "Tagging Method already exists" });
    }
  } catch (err) {
    next(err);
  }
};
const updateAssetMethod = async (req, res, next) => {
  const { id, newMethod } = req.body;
  console.log(req.body);
  try {
    const existingMethod = await assetCategoryModel.findOne({
      id: id,
    });
    if (!existingMethod) {
      return res
        .status(422)
        .json({ error: "Category to be updated not found" });
    }

    if (existingMethod.method === newMethod) {
      return res.status(422).json({ error: "Tag Method already exists" });
    }
    const updated = await assetCategoryModel.findByIdAndUpdate(
      existingMethod._id,
      {
        method: newMethod,
      }
    );
    if (updated) {
      return res.status(200).json({ msg: "Tag Method updated successfully" });
    } else {
      return res.status(422).json({ error: "Could not update Tag Method" });
    }
  } catch (err) {
    console.log(err);
  }
};
const addAssetTemplate = async (req, res, next) => {
  const { category, templateId } = req.body;
  try {
    existingCategory = await assetCategoryModel.findOne({ id: category });
    if (!existingCategory) {
      return res.status(422).json({ error: "Category doesnot exist" });
    }

    if (!existingCategory.templateId) {
      const template = await templateModel.findOne({ id: templateId });
      console.log("Template", template);
      const updated = await assetCategoryModel.findByIdAndUpdate(
        existingCategory._id,
        {
          templateId: templateId,
          templateName: template.name,
        }
      );
      if (updated) {
        res.status(200).json({
          msg: "Category Template added successfully",
          data: existingCategory,
        });
      } else {
        return res
          .status(422)
          .json({ error: "Could not add category template" });
      }
    } else {
      return res
        .status(422)
        .json({ error: "Category Template already exists" });
    }
  } catch (err) {
    next(err);
  }
};
const updateAssetTemplate = async (req, res, next) => {
  const { id, tempId } = req.body;
  console.log(req.body);
  try {
    const existingTemplate = await assetCategoryModel.findOne({
      id: id,
    });
    console.log("Template to update", existingTemplate);
    if (!existingTemplate) {
      return res
        .status(422)
        .json({ error: "Category to be updated not found" });
    }

    if (existingTemplate.templateId === tempId) {
      return res.status(422).json({ error: "Template already exists" });
    }
    const template = await templateModel.findOne({ id: tempId });
    console.log("Template in list", template);

    const updated = await assetCategoryModel.findByIdAndUpdate(
      existingTemplate._id,
      {
        templateId: template.id,
        templateName: template.name,
      }
    );

    if (updated) {
      return res.status(200).json({ msg: "Tag Template updated successfully" });
    } else {
      return res.status(422).json({ error: "Could not update Tag Template" });
    }
  } catch (err) {
    console.log(err);
  }
};
const deleteAssetMethod = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingMethod = await assetCategoryModel.findOne({ id: id });
    console.log("existing", existingMethod);
    if (!existingMethod) {
      return res
        .status(400)
        .json({ error: "Asset Tagging Method doesnot exist" });
    }
    const updated = await assetCategoryModel.findByIdAndUpdate(
      existingMethod._id,
      {
        method: null,
        templateId: null,
        templateName: "",
      }
    );
    if (updated) {
      return res.status(200).json({
        msg: "Tagging Method deleted successfully",
      });
    } else {
      return res.status(422).json({ error: "Could not delete tagging method" });
    }
  } catch (err) {
    next(err);
  }
};
const deleteAssetTemplate = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingTemplate = await assetCategoryModel.findOne({ id: id });
    console.log("existing", existingTemplate);
    if (!existingTemplate) {
      return res.status(400).json({ error: "Template doesnot exist" });
    }
    const updated = await assetCategoryModel.findByIdAndUpdate(
      existingTemplate._id,
      {
        templateId: null,
        templateName: "",
      }
    );
    if (updated) {
      return res.status(200).json({
        msg: "Template deleted successfully",
      });
    } else {
      return res
        .status(422)
        .json({ error: "Could not delete category template" });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addAssetCategory,
  allAssetCategory,
  deleteAssetCategory,
  updateAssetCategory,
  addAssetMethod,
  updateAssetMethod,
  addAssetTemplate,
  updateAssetTemplate,
  deleteAssetMethod,
  deleteAssetTemplate,
};
