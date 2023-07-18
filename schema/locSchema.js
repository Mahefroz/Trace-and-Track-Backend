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
  ownerName: {
    type: String,
    trim: true,
    required: [true, "Owner Name not provided"],
  },
  pno: {
    type: Number,

    required: [true, "Owner Phone no not provided"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Owner Email address no not provided"],
  },
  business: [
    {
      businessCategory: {
        type: Number,
        required: [true, "Business Id not provided"],
      },
      businessName: {
        type: String,
        required: [true, "Business Name not provided"],
      },
      location: {
        latitude: {
          type: Number,
          required: [true, "Latitiude not provided"],
        },
        longitude: {
          type: Number,
          required: [true, "Longitude not provided"],
        },
      },
      //  assets: [
      //   {
      //     no: {
      //       type: Number,
      //       required: [
      //         true,
      //         "Asset no not provided. Cannot create location tag location without asset no",
      //       ],
      //     },
      //     name: {
      //       type: String,
      //       trim: true,
      //       required: [
      //         true,
      //         "Asset Name not provided. Cannot create location tag location without Asset Name",
      //       ],
      //     },
      //     desc: {
      //       type: String,
      //       trim: true,
      //       required: [
      //         true,
      //         "Asset Description not provided. Cannot create location tag location without Asset Description",
      //       ],
      //     },
      //     status: {
      //       type: String,
      //       trim: true,
      //       required: [
      //         true,
      //         "Asset Status not provided. Cannot create location tag location without Asset Status",
      //       ],
      //     },
      //     lat: {
      //       type: Number,
      //       trim: true,
      //       required: [
      //         true,
      //         "Asset Latitude not provided. Cannot create location tag location without Asset Latitude",
      //       ],
      //     },
      //     long: {
      //       type: Number,
      //       trim: true,
      //       required: [
      //         true,
      //         "Asset Longitude not provided. Cannot create location tag location without Asset Longitude",
      //       ],
      //     },
      //   },
      // ],
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
