const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");

const templateSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: [true, "Template name not provided"],
    unique: [true, "Template name already exists"],
  },
  template: {
    type: Object,
    required: [true, "Template detail not provided"],
  },
});

templateSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("templates");
    this.id = id; // Incremented
    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("templates", templateSchema);
