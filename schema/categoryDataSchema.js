const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
// const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");

const categoryDataSchema = new mongoose.Schema({
  categoryId: {
    type: Number,
  },

  data: [
    {
      type: Object,
      required: [true, "Details not provided"],
      date: { type: String },
      details: {},
    },
  ],
});

// categoryDataSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const id = await counter.getNextId("categoryData");
//     this.serailNo = id; // Incremented
//     next();
//   } else {
//     next();
//   }
// });
module.exports = mongoose.model("categoryData", categoryDataSchema);
