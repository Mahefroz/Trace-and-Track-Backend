const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");

const assetDetailSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },

  name: {
    type: String,
    trim: true,
    required: [true, "Asset Name not provided"],
  },
  desc: {
    type: String,
    trim: true,
    required: [true, "Asset Description not provided"],
  },
  categoryId: {
    type: Number,
    required: [true, "Asset Category ID not provided"],
  },
  categoryName: {
    type: String,
    trim: true,
    required: [true, "Asset Category Name not provided"],
  },
});

assetDetailSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("assetDetail");
    this.id = id; // Incremented

    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("assetDetail", assetDetailSchema);
