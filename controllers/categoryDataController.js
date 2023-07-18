const categoryDataModel = require("../schema/categoryDataSchema");
const categoryModel = require("../schema/categorySchema");
const templateModel = require("../schema/templateSchema");
const fs = require("fs");
var isEqual = require("lodash/isEqual");
var size = require("lodash/size");

const addCategoryData = async (req, res, next) => {
  const { categoryId, data } = req.body;
  console.log("Size", size(data.rows[0]));
  console.log("Data in body", data);

  try {
    existingCategory = await categoryModel.findOne({ id: categoryId });

    if (!existingCategory) {
      return res.status(400).json({ error: "Category doesnot exist" });
    }
    if (!existingCategory.templateId) {
      return res.status(400).json({ error: "No template found" });
    }

    //calculate serial no , batch no

    let serialNo = existingCategory.serialNo + size(data.rows[0]);
    let batchNo = existingCategory.batchNo + size(data.rows[0]);

    //find template assigned to category
    existingTemplate = await templateModel.findOne({
      id: existingCategory.templateId,
    });

    //add fields according to tag
    let updatedtemplate = existingTemplate.template;
    updatedtemplate.push("Date");
    if (existingCategory.method === 1) {
      updatedtemplate.push("Image");
    }
    if (existingCategory.method === 2) {
      updatedtemplate.push("Image");
    }
    if (existingCategory.method === 3) {
      updatedtemplate.push("Serial No");
    }
    if (existingCategory.method === 4) {
      if (data.cols.includes("Batch Quantity")) {
        let index = data.cols.indexOf("Batch Quantity");
        updatedtemplate.splice(index, 0, "Batch Quantity");
        updatedtemplate.push("Batch No");

        console.log("Batch temp", updatedtemplate, data.cols);
      }
    }

    console.log(
      "Template",
      existingTemplate.template,
      updatedtemplate,
      existingTemplate
    );
    //validate template

    if (!isEqual(updatedtemplate, data.cols)) {
      return res.status(422).json({ error: "Template doesnot match" });
    }

    existingData = await categoryDataModel.findOne({ categoryId: categoryId });
    //data added first time
    if (!existingData) {
      if (existingCategory.method === 3) {
        const result = await categoryDataModel.create({
          categoryId: categoryId,
          data: {
            date: Date.now(),
            details: data,
          },
        });
        const updateSno = await categoryModel.findByIdAndUpdate(
          existingCategory._id,
          {
            serialNo: serialNo,
          }
        );
        return res
          .status(200)
          .json({ msg: "Category Data added successfully" });
      }
      if (existingCategory.method === 4) {
        const result = await categoryDataModel.create({
          categoryId: categoryId,
          data: {
            date: Date.now(),
            details: data,
          },
        });
        const updateBno = await categoryModel.findByIdAndUpdate(
          existingCategory._id,
          {
            batchNo: batchNo,
          }
        );
        return res
          .status(200)
          .json({ msg: "Category Data added successfully" });
      }
      const result = await categoryDataModel.create({
        categoryId: categoryId,
        data: {
          date: Date.now(),
          details: data,
        },
      });

      return res.status(200).json({ msg: "Category Data added successfully" });
    } else {
      //adding data to same category
      if (existingCategory.method === 3) {
        const updated = await categoryDataModel.updateOne(
          { _id: existingData._id },
          {
            $push: {
              data: {
                date: Date.now(),
                details: data,
              },
            },
          }
        );
        const updateSno = await categoryModel.findByIdAndUpdate(
          existingCategory._id,
          {
            serialNo: serialNo,
          }
        );
        // console.log("Serial no updated", serialNo, updateSno);
        if (updated) {
          return res
            .status(200)
            .json({ msg: "Category Data added successfully" });
        } else {
          return res.status(422).json({ msg: "Could not add category Data" });
        }
      }
      if (existingCategory.method === 4) {
        const updated = await categoryDataModel.updateOne(
          { _id: existingData._id },
          {
            $push: {
              data: {
                date: Date.now(),
                details: data,
              },
            },
          }
        );
        const updateBno = await categoryModel.findByIdAndUpdate(
          existingCategory._id,
          {
            batchNo: batchNo,
          }
        );
        console.log("Batch no updated", serialNo, updateBno);
        if (updated) {
          return res
            .status(200)
            .json({ msg: "Category Data added successfully" });
        } else {
          return res.status(422).json({ msg: "Could not add category Data" });
        }
      }
      const updated = await categoryDataModel.updateOne(
        { _id: existingData._id },
        {
          $push: {
            data: {
              date: Date.now(),
              details: data,
            },
          },
        }
      );
      if (updated) {
        return res
          .status(200)
          .json({ msg: "Category Data added successfully" });
      } else {
        return res.status(422).json({ msg: "Could not add category Data" });
      }
    }
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const existingData = await categoryDataModel.findOne({
      categoryId: categoryId,
    });
    if (!existingData) {
      return res.status(400).json({ error: "Data doesnot exist" });
    }
    return res
      .status(200)
      .json({ msg: "Products found successfully", data: existingData.data });
  } catch (err) {
    next(err);
  }
};

const getCurrentSerialNo = async (req, res, next) => {
  const { categoryId } = req.body;
  console.log(categoryId);
  try {
    const existingCategory = await categoryModel.findOne({
      id: categoryId,
    });
    if (!existingCategory) {
      return res.status(400).json({ error: "Category doesnot exist" });
    }
    console.log("Serial No", existingCategory.serialNo, existingCategory);
    return res.status(200).json({
      msg: "Serial no found successfully",
      data: existingCategory.serialNo,
    });
  } catch (err) {
    next(err);
  }
};
const getCurrentBatchNo = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const existingCategory = await categoryModel.findOne({
      id: categoryId,
    });
    if (!existingCategory) {
      return res.status(400).json({ error: "Category doesnot exist" });
    }
    return res.status(200).json({
      msg: "Batch no found successfully",
      data: existingCategory.batchNo,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCategoryData,
  getCurrentSerialNo,
  getCurrentBatchNo,
  getAllProducts,
};
