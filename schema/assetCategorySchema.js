const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");
const errorHandler = require("../middleware/errorHandler");

const assetCategorySchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },

  category: {
    type: String,
    trim: true,
    required: [true, "Asset Category not provided"],
  },
  method: {
    type: Number,
  },
  templateId: {
    type: Number,
  },
  templateName: {
    type: String,
  },
});

assetCategorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("assetCategories");
    this.id = id; // Incremented

    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("assetCategories", assetCategorySchema);
