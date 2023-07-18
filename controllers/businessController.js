const businessModel = require("../schema/businessSchema");
const templateModel = require("../schema/templateSchema");

const fs = require("fs");

const addBusinessType = async (req, res, next) => {
  const { category } = req.body;
  try {
    const existingType = await businessModel.findOne({ category: category });
    console.log("existing", existingType);
    if (existingType) {
      return res.status(422).json({ error: "Business Type already present" });
    }

    const result = await businessModel.create({
      category: category,
    });

    return res
      .status(200)
      .json({ msg: "Business Type added successfully", data: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const allBusinessTypes = async (req, res, next) => {
  try {
    const allBusinessTypes = await businessModel.find({});
    console.log("all", allBusinessTypes);
    if (allBusinessTypes) {
      return res.status(200).json({
        msg: "Business Types found successfully",
        data: allBusinessTypes,
      });
    } else {
      return res.status(400).json({ error: "No Business Types found" });
    }
  } catch (err) {
    next(err);
  }
};
const deleteBusinessType = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const existingType = await businessModel.findOne({ id: categoryId });
    console.log("existing", existingType);
    if (!existingType) {
      return res.status(400).json({ error: "Business Category doesnot exist" });
    }
    const deleted = await businessModel.findByIdAndDelete(existingType._id);
    const deletedMethod = await businessModel.findOne({ id: categoryId });
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
const updateBusinessType = async (req, res, next) => {
  const { id, newCategory } = req.body;
  console.log(req.body);
  try {
    const existingCategory = await businessModel.findOne({
      id: id,
    });
    if (!existingCategory) {
      return res
        .status(422)
        .json({ error: "Category to be updated not found" });
    }
    const sameName = await businessModel.findOne({ category: newCategory });
    console.log("Same", sameName);
    if (sameName) {
      return res
        .status(422)
        .json({ error: "Category with same name already exists" });
    }
    const updated = await businessModel.findByIdAndUpdate(
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

const addBusinessMethod = async (req, res, next) => {
  const { category, method } = req.body;
  console.log("Body", req.body);
  try {
    if (!method) {
      return res.status(422).json({ error: "Category method not provided" });
    }
    const existingCategory = await businessModel.findOne({
      id: category,
    });
    console.log("Existing", existingCategory);
    if (!existingCategory) {
      return res.status(400).json({ error: "Category not found" });
    }
    if (!existingCategory.method) {
      const updated = await businessModel.findByIdAndUpdate(
        existingCategory._id,
        {
          method: method,
        }
      );
      if (updated) {
        return res.status(200).json({
          msg: "Business Tagging Method added successfully",
        });
      } else {
        return res
          .status(422)
          .json({ error: "Could not add business tagging method" });
      }
    } else {
      return res.status(422).json({ error: "Tagging Method already exists" });
    }
  } catch (err) {
    next(err);
  }
};
const addBusinessTemplate = async (req, res, next) => {
  const { category, templateId } = req.body;
  try {
    existingCategory = await businessModel.findOne({ id: category });
    if (!existingCategory) {
      return res.status(422).json({ error: "Category doesnot exist" });
    }

    if (!existingCategory.templateId) {
      const template = await templateModel.findOne({ id: templateId });
      console.log("Template", template);
      const updated = await businessModel.findByIdAndUpdate(
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
const updateBusinessTemplate = async (req, res, next) => {
  const { id, tempId } = req.body;
  console.log(req.body);
  try {
    const existingTemplate = await businessModel.findOne({
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

    const updated = await businessModel.findByIdAndUpdate(
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
const updateBusinessMethod = async (req, res, next) => {
  const { id, newMethod } = req.body;
  console.log(req.body);
  try {
    const existingMethod = await businessModel.findOne({
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
    const updated = await businessModel.findByIdAndUpdate(existingMethod._id, {
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
const deleteBusinessMethod = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingMethod = await businessModel.findOne({ id: id });
    console.log("existing", existingMethod);
    if (!existingMethod) {
      return res.status(400).json({ error: "Category Method doesnot exist" });
    }
    const updated = await businessModel.findByIdAndUpdate(existingMethod._id, {
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
const deleteBusinessTemplate = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingMethod = await businessModel.findOne({ id: id });
    console.log("existing", existingMethod);
    if (!existingMethod) {
      return res.status(400).json({ error: "Template doesnot exist" });
    }
    const updated = await businessModel.findByIdAndUpdate(existingMethod._id, {
      templateId: null,
      templateName: "",
    });
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
const allBusinessMethods = async (req, res, next) => {
  try {
    const allMethods = await businessModel.find({});
    if (allMethods) {
      return res.status(200).json({
        msg: "Business methods found successfully",
        data: allMethods,
      });
    } else {
      return res.status(422).json({ error: "Tagging Method not found" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addBusinessType,
  allBusinessTypes,
  deleteBusinessType,
  updateBusinessType,
  addBusinessMethod,
  updateBusinessMethod,
  addBusinessTemplate,
  updateBusinessTemplate,
  allBusinessMethods,
  deleteBusinessMethod,
  deleteBusinessTemplate,
};
