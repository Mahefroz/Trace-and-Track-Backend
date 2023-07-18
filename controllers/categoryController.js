const categoryModel = require("../schema/categorySchema");
const categoryDataModel = require("../schema/categoryDataSchema");
const templateModel = require("../schema/templateSchema");
const productDetailModel = require("../schema/productDetailSchema");
const fs = require("fs");

const addSingleCategory = async (req, res, next) => {
  const { category } = req.body;
  try {
    existingCategory = await categoryModel.findOne({ category: category });
    console.log("existing", existingCategory);
    if (existingCategory) {
      // if (existingTag.lat === lat || existingTag.long === long) {
      return res.status(422).json({ error: "Category already present" });
      // }
    }
    const result = await categoryModel.create({
      category: category,
    });
    return res
      .status(200)
      .json({ msg: "Category added successfully", data: result });
  } catch (err) {
    next(err);
  }
};
const allCategories = async (req, res, next) => {
  try {
    const allCategories = await categoryModel.find({});
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
const deleteSingleCategory = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const existingCategory = await categoryModel.findOne({
      id: categoryId,
    });
    console.log("Existing Category", existingCategory);
    if (!existingCategory) {
      return res.status(400).json({ error: "Category doesnot exist" });
    }
    const products = await productDetailModel.findOne({
      categoryId: categoryId,
    });
    // console.log("Products", products);
    if (products && products.products.length !== 0) {
      const deletProductDetails = await productDetailModel.findByIdAndDelete(
        products._id
      );
    }
    const deleted = await categoryModel.findByIdAndDelete(existingCategory._id);
    const deletedCategory = await categoryModel.findOne({ id: categoryId });
    if (!deletedCategory) {
      return res.status(200).json({ msg: "Category deleted successfully" });
    } else {
      return res.status(422).json({ error: "Could not delete category" });
    }
  } catch (err) {
    console.log(err);
  }
};
const updateSingleCategory = async (req, res, next) => {
  const { id, newCategory } = req.body;
  console.log(req.body);
  try {
    const existingCategory = await categoryModel.findOne({
      id: id,
    });
    if (!existingCategory) {
      return res
        .status(422)
        .json({ error: "Category to be updated not found" });
    }
    const sameName = await categoryModel.findOne({ category: newCategory });
    console.log("Same", sameName);
    if (sameName) {
      return res
        .status(422)
        .json({ error: "Category with same name already exists" });
    }
    const updated = await categoryModel.findByIdAndUpdate(
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
const addCategoryMethod = async (req, res, next) => {
  const { category, method } = req.body;
  console.log("Body", req.body);
  try {
    if (!method) {
      return res.status(422).json({ error: "Category method  not provided" });
    }
    const existingCategory = await categoryModel.findOne({
      id: category,
    });
    console.log("Existing", existingCategory);
    if (!existingCategory) {
      return res.status(400).json({ error: "Category not found" });
    }
    if (!existingCategory.method) {
      const updated = await categoryModel.findByIdAndUpdate(
        existingCategory._id,
        {
          method: method,
        }
      );
      if (updated) {
        return res.status(200).json({
          msg: "Category Tagging Method added successfully",
        });
      } else {
        return res
          .status(422)
          .json({ error: "Could not add category tagging method" });
      }
    } else {
      return res.status(422).json({ error: "Tagging Method already exists" });
    }
  } catch (err) {
    next(err);
  }
};
const allCategoryMethods = async (req, res, next) => {
  try {
    const allMethods = await categoryModel.find({});
    if (allMethods) {
      return res.status(200).json({
        msg: "Category methods found successfully",
        data: allMethods,
      });
    } else {
      return res.status(422).json({ error: "Tagging Method not found" });
    }
  } catch (err) {
    next(err);
  }
};
const updateCategoryMethod = async (req, res, next) => {
  const { id, newMethod } = req.body;
  console.log(req.body);
  try {
    const existingMethod = await categoryModel.findOne({
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
    const updated = await categoryModel.findByIdAndUpdate(existingMethod._id, {
      method: newMethod,
    });
    if (updated) {
      return res.status(200).json({ msg: "Tag Method updated successfully" });
    } else {
      return res.status(422).json({ error: "Could not update Tag Method" });
    }
  } catch (err) {
    console.log(err);
  }
};
const deleteCategoryMethod = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingMethod = await categoryModel.findOne({ id: id });
    console.log("existing", existingMethod);
    if (!existingMethod) {
      return res.status(400).json({ error: "Category Method doesnot exist" });
    }
    const updated = await categoryModel.findByIdAndUpdate(existingMethod._id, {
      method: null,
    });
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

const addCategoryTemplate = async (req, res, next) => {
  const { category, templateId } = req.body;
  try {
    existingCategory = await categoryModel.findOne({ id: category });
    if (!existingCategory) {
      return res.status(422).json({ error: "Category doesnot exist" });
    }

    if (!existingCategory.templateId) {
      const template = await templateModel.findOne({ id: templateId });
      console.log("Template", template);
      const updated = await categoryModel.findByIdAndUpdate(
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
const updateCategoryTemplate = async (req, res, next) => {
  const { id, tempId } = req.body;
  console.log(req.body);
  try {
    const existingTemplate = await categoryModel.findOne({
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

    const updated = await categoryModel.findByIdAndUpdate(
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
const deleteCategoryTemplate = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingCategory = await categoryModel.findOne({ id: id });

    if (!existingCategory) {
      return res.status(400).json({ error: "Category doesnot exist" });
    }
    if (existingCategory.templateId) {
      const data = await categoryDataModel.findOne({
        categoryId: existingCategory.id,
      });
      console.log("existing Data", data);
      if (data) {
        return res
          .status(422)
          .json({ error: "Data exists, could not delete template" });
      } else {
        const updated = await categoryModel.findByIdAndUpdate(
          existingCategory._id,
          {
            templateId: null,
            templateName: "",
          }
        );
        if (updated) {
          return res.status(200).json({
            msg: "Category Template deleted successfully",
          });
        } else {
          return res
            .status(422)
            .json({ error: "Could not delete category template" });
        }
      }
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addSingleCategory,
  allCategories,
  addCategoryMethod,
  updateCategoryMethod,
  addCategoryTemplate,
  updateCategoryTemplate,
  allCategoryMethods,
  deleteSingleCategory,
  updateSingleCategory,
  deleteCategoryMethod,
  deleteCategoryTemplate,
};
