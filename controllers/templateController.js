const templateModel = require("../schema/templateSchema");
const categoryModel = require("../schema/categorySchema");
const categoryDataModel = require("../schema/categoryDataSchema");
const fs = require("fs");
const { findByIdAndUpdate } = require("../schema/counterSchema");

const addTemplate = async (req, res, next) => {
  const { name, template } = req.body;
  try {
    const existingTemplate = await templateModel.findOne({ name: name });
    if (existingTemplate) {
      return res
        .status(422)
        .json({ error: "Template with same name already exists" });
    }
    const result = await templateModel.create({
      name: name,
      template: template,
    });
    return res
      .status(200)
      .json({ msg: "Template added successfully", data: result });
  } catch (err) {
    next(err);
  }
};
const updateTemplate = async (req, res, next) => {
  const { id, newName } = req.body;
  console.log(req.body);
  try {
    const existingTemplate = await templateModel.findOne({
      id: id,
    });
    if (!existingTemplate) {
      return res
        .status(422)
        .json({ error: "Template to be updated not found" });
    }

    if (existingTemplate.name === newName) {
      return res
        .status(422)
        .json({ error: "Template with same name already exists" });
    }
    const updated = await templateModel.findByIdAndUpdate(
      existingTemplate._id,
      {
        name: newName,
      }
    );
    if (updated) {
      return res.status(200).json({ msg: "Template updated successfully" });
    } else {
      return res.status(422).json({ error: "Could not update Template" });
    }
  } catch (err) {
    console.log(err);
  }
};
const updateTemplateDetails = async (req, res, next) => {
  const { id, template } = req.body;
  console.log(req.body);
  try {
    const existingTemplate = await templateModel.findOne({
      id: id,
    });
    if (!existingTemplate) {
      return res
        .status(422)
        .json({ error: "Template to be updated not found" });
    }
    const updated = await templateModel.findByIdAndUpdate(
      existingTemplate._id,
      {
        template: template,
      }
    );
    if (updated) {
      return res
        .status(200)
        .json({ msg: "Template details updated successfully" });
    } else {
      return res
        .status(422)
        .json({ error: "Could not update Template Details" });
    }
  } catch (err) {
    console.log(err);
  }
};
const getSingleTemplate = async (req, res, next) => {
  const { templateId } = req.body;
  try {
    const existingTemplate = await templateModel.findOne({
      id: templateId,
    });
    if (!existingTemplate) {
      return res.status(400).json({ error: "Template not found" });
    } else {
      return res
        .status(200)
        .json({ msg: "Templates found successfully", data: existingTemplate });
    }
  } catch (err) {
    next(err);
  }
};
const allTemplates = async (req, res, next) => {
  try {
    const allTemplates = await templateModel.find({});
    console.log("all", allTemplates);
    if (allTemplates) {
      return res
        .status(200)
        .json({ msg: "Templates found successfully", data: allTemplates });
    } else {
      return res.status(400).json({ error: "No templates found" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteSingleTemplate = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingTemplate = await templateModel.findOne({ id: id });
    if (!existingTemplate) {
      return res.status(400).json({ error: "Template doesnot exist" });
    }
    console.log("Existing Template", existingTemplate);
    const assignedTemplate = await categoryModel.findOne({ templateId: id });
    console.log("Assigned Template", assignedTemplate);
    if (!assignedTemplate) {
      const deleteTemplate = await templateModel.findByIdAndDelete(
        existingTemplate._id
      );

      return res.status(200).json({ msg: "Template deleted successfully" });
    }

    let templateData;
    templateData = await categoryDataModel.findOne({
      categoryId: assignedTemplate.id,
    });
    console.log("template data", templateData);
    if (assignedTemplate && templateData) {
      return res
        .status(422)
        .json({ error: "Data exists on template,Could not delete template" });
    } else if (assignedTemplate && !templateData) {
      const removeAssignment = await categoryModel.findByIdAndUpdate(
        assignedTemplate._id,
        {
          templateId: null,
          templateName: "",
        }
      );
      const deleteTemplate = await templateModel.findByIdAndDelete(
        existingTemplate._id
      );

      return res.status(200).json({ msg: "Template deleted successfully" });
    }

    // const deleted = await templateModel.findByIdAndDelete(existingTemplate._id);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addTemplate,
  updateTemplate,
  updateTemplateDetails,
  allTemplates,
  getSingleTemplate,
  deleteSingleTemplate,
};
