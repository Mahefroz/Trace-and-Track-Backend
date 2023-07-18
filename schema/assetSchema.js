const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const counter = require("./counterSchema");

const errorHandler = require("../middleware/errorHandler");

const assetSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  asset_no: {
    type: Number,
    required: [
      true,
      "Asset no not provided. Cannot create tag without asset no",
    ],
  },
  name: {
    type: String,
    trim: true,
    required: [
      true,
      "Asset Name not provided. Cannot create tag without Asset Name",
    ],
  },
  desc: {
    type: String,
    trim: true,
    required: [
      true,
      "Asset Description not provided. Cannot create  tag without Asset Description",
    ],
  },
  status: {
    type: String,
    trim: true,
    required: [
      true,
      "Asset Status not provided. Cannot create  tag  without Asset Status",
    ],
  },
  lat: {
    type: Number,
    trim: true,
    required: [
      true,
      "Asset Latitude not provided. Cannot create  tag  without Asset Latitude",
    ],
  },
  long: {
    type: Number,
    trim: true,
    required: [
      true,
      "Asset Longitude not provided. Cannot create tag without Asset Longitude",
    ],
  },
  img: [
    {
      data: Buffer,
      contentType: Object,
    },
  ],
  //   img: {
  //     data: Buffer,
  //     contentType: Object,
  //   },
  method: {
    type: "String",
  },
  tag: {
    data: Buffer,
    contentType: Object,
  },
  no: {
    type: Number,
    trim: true,
    // required: [
    //  true,
    //   "S.no or B.no not provided. Cannot create asset tag  without S.no or B.no",
    // ],
  },
});

assetSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await counter.getNextId("asset");
    this.id = id; // Incremented

    next();
  } else {
    next();
  }
});
module.exports = mongoose.model("assets", assetSchema);
