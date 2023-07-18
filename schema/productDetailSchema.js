const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");

const productDetailSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  // name: {
  //   type: String,
  //   trim: true,
  // },
  // desc: {
  //   type: String,
  //   trim: true,
  // },

  products: [
    {
      trim: true,
      type: String,
      required: [true, "Product name not provided"],
    },
  ],
  categoryId: {
    type: Number,
    required: [true, "Category ID not provided"],
  },
});

productDetailSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("productDetails");
    this.id = id; // Incremented
    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("productDetails", productDetailSchema);
