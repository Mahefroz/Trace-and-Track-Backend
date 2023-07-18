const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");
const counterSchema = require("./counterSchema");

const locSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  cnic: {
    type: String,
    trim: true,
    required: [
      true,
      "Customer cnic not provided. Cannot create location tag without customer cnic ",
    ],
  },
  details: {
    type: Object,
    required: [
      true,
      "Details not provided. Cannot create product without Details ",
    ],
  },
  lat: {
    type: String,
    required: [
      true,
      "Latitiude not provided. Cannot create location tag location without latitude",
    ],
  },
  long: {
    type: String,
    required: [
      true,
      "Longitude not provided. Cannot create location tag location without longitude",
    ],
  },
  assets: [
    {
      no: {
        type: Number,
        required: [
          true,
          "Asset no not provided. Cannot create location tag location without asset no",
        ],
      },
      name: {
        type: String,
        trim: true,
        required: [
          true,
          "Asset Name not provided. Cannot create location tag location without Asset Name",
        ],
      },
      desc: {
        type: String,
        trim: true,
        required: [
          true,
          "Asset Description not provided. Cannot create location tag location without Asset Description",
        ],
      },
      status: {
        type: String,
        trim: true,
        required: [
          true,
          "Asset Status not provided. Cannot create location tag location without Asset Status",
        ],
      },
      lat: {
        type: Number,
        trim: true,
        required: [
          true,
          "Asset Latitude not provided. Cannot create location tag location without Asset Latitude",
        ],
      },
      long: {
        type: Number,
        trim: true,
        required: [
          true,
          "Asset Longitude not provided. Cannot create location tag location without Asset Longitude",
        ],
      },
    },
  ],
});

locSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("location");
    this.id = id; // Incremented

    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("location", locSchema);
