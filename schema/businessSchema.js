const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");
const counterSchema = require("./counterSchema");

const businessSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    trim: true,
    required: [true, "Business Type not provided "],
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

businessSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("business");
    this.id = id; // Incremented

    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("business", businessSchema);
