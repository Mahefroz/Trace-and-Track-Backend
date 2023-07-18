const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");

const productSchema = new mongoose.Schema({
  pid: {
    type: Number,
    default: 0,
  },
  pno: {
    type: Number,
    required: [
      true,
      "Product No not provided. Cannot create product without Product No",
    ],
  },
  name: {
    type: String,
    required: [
      true,
      "Product name not provided. Cannot create product without Product name ",
    ],
  },
  details: {
    type: Object,
    required: [
      true,
      "Deatils not provided. Cannot create product without Deatils ",
    ],
  },
  method: {
    type: String,
    required: [
      true,
      "Tag method not provided. Cannot create product without tagging method ",
    ],
  },
  img: {
    data: Buffer,
    contentType: Object,
  },
  no: {
    type: String,
  },
});

productSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("products");
    this.pid = id; // Incremented
    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("products", productSchema);
