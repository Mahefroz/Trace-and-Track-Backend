const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    trim: true,
    required: [true, "Category not provided"],
  },
  method: {
    type: Number,
  },
  serialNo: {
    type: Number,
    default: 0,
  },
  batchNo: {
    type: Number,
    default: 0,
  },
  templateId: {
    type: Number,
  },
  templateName: {
    type: String,
  },
});

categorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("categories");
    this.id = id; // Incremented
    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("categories", categorySchema);
