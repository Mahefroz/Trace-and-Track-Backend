const locModel = require("../schema/locSchema");
const geolib = require("geolib");
const fs = require("fs");

const addLocation = async (req, res, next) => {
  const { cnic, ownerName, pno, email, business } = req.body;
  // console.log("Body", req.body);
  try {
    existingTag = await locModel.findOne({ cnic: cnic });
    allTags = await locModel.find({});
    let validate = true;
    console.log("existing", existingTag);
    allTags.map((tag) => {
      tag.business.map((row) => {
        if (row.businessName === business[0].businessName) {
          validate = false;
          return res
            .status(422)
            .json({ error: "Business Name already present" });
        }
        let distance = geolib.getDistance(row.location, business[0].location);
        if (distance < 250) {
          validate = false;
          return res.status(422).json({
            error:
              "Location already exists, new location should be greater than 250 meters apart",
          });
        }
      });
    });
    if (!validate) {
      return;
    }
    if (existingTag) {
      const updated = await locModel.updateOne(
        { _id: existingTag._id },
        {
          $push: {
            business: business,
          },
        }
      );
      if (updated) {
        return res.status(200).json({ msg: "Tag added successfully" });
      } else {
        return res
          .status(200)
          .json({ error: "Could not add customer location" });
      }
    } else if (!existingTag) {
      const result = await locModel.create({
        cnic: cnic,
        ownerName: ownerName,
        pno: pno,
        email: email,
        business: business,
      });
      return res
        .status(200)
        .json({ msg: "Tag added successfully", data: result });
    }
  } catch (err) {
    next(err);
  }
};
const getExcelTemplate = async (req, res, next) => {
  const excelTemplate = [
    { "Company Name": "" },
    { "Owner Name": "" },
    { Cnic: "" },
    { "Phone no": "" },
    { Email: "" },
    { Latitude: "" },
    { Longitude: "" },
  ];
  return res
    .status(200)
    .json({ msg: "Excel Template found successfully", data: excelTemplate });
};
// const addLocation = async (req, res, next) => {
//   const { cnic, details, lat, long, assets } = req.body;
//   console.log("Body", req.body);
//   try {
//     existingTag = await locModel.findOne({ cnic: cnic });
//     console.log("existing", existingTag);
//     if (existingTag) {
//       // if (existingTag.lat === lat || existingTag.long === long) {
//       return res.status(422).json({ error: "Location Tag already present" });
//       // }
//     }
//     const result = await locModel.create({
//       cnic: cnic,
//       details: details,
//       lat: lat,
//       long: long,
//       assets: assets,
//     });
//     return res
//       .status(200)
//       .json({ msg: "Tag added successfully", data: result });
//   } catch (err) {
//     next(err);
//   }
// };

const allLocationTags = async (req, res, next) => {
  try {
    const customers = await locModel.find({});
    console.log("Customers", customers);
    if (customers) {
      return res
        .status(200)
        .json({ msg: "Customers found Successfully", data: customers });
    } else {
      return res.status(400).json({ msg: "Customers not found " });
    }
  } catch (err) {
    next(err);
  }
};

const updateBusinessLocation = async (req, res, next) => {
  const { id, cnic, details, lat, long, assets } = req.body;
  try {
    const existingLoc = await locModel.findOne({ id: id });
    if (!existingLoc) {
      return res.status(400).json({ error: "Location tag doesnot exist" });
    }

    if (cnic) {
      const updated = await locModel.findByIdAndUpdate(existingLoc._id, {
        cnic: cnic,
        details: details,
        lat: lat,
        long: long,
        assets: assets,
      });

      if (updated) {
        return res
          .status(200)
          .json({ msg: "Location Tag updated successfully" });
      } else {
        return res
          .status(422)
          .json({ msg: "Couldnot update Business Location " });
      }
    } else {
      const updated = await locModel.findByIdAndUpdate(existingLoc._id, {
        cnic: existingLoc.cnic,
        details: details,
        lat: lat,
        long: long,
      });

      if (updated) {
        return res
          .status(200)
          .json({ msg: "Location Tag updated successfully" });
      } else {
        return res
          .status(422)
          .json({ msg: "Couldnot update Business Location " });
      }
    }
  } catch (err) {
    next(err);
  }
};
const deleteLocationTag = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingLoc = await locModel.findOne({ id: id });
    if (!existingLoc) {
      return res.status(400).json({ error: "Location Tag doesnot exist" });
    }
    const deleted = await locModel.findByIdAndDelete(existingLoc._id);
    const deletedLoc = await locModel.findOne({ id: id });

    if (!deletedLoc) {
      return res.status(200).json({
        msg: "Location Tag deleted successfully",
      });
    } else {
      return res.status(422).json({ msg: "Couldnot delete tag" });
    }
  } catch (err) {
    next(err);
  }
};
const addLocationAssets = async (req, res, next) => {
  const { id, assets } = req.body;
  try {
    const existingLoc = await locModel.findOne({ id: id });
    if (!existingLoc) {
      return res.status(400).json({ error: "Location Tag doesnot exist" });
    }

    // console.log(existingLoc.assets);
    const updated = await locModel.updateOne(
      { _id: existingLoc._id },
      {
        $push: {
          assets: assets,
        },
      }
    );

    if (updated.acknowledged === true) {
      return res.status(200).json({ msg: "Assets added successfully" });
    } else {
      return res
        .status(422)
        .json({ msg: "Couldnot add assets to business location" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const removeLocationAssets = async (req, res, next) => {
  const { id, no } = req.body;
  try {
    const existingLoc = await locModel.findOne({ id: id });
    if (!existingLoc) {
      return res.status(400).json({ error: "Location Tag doesnot exist" });
    }
    if (existingLoc.assets.length === 0) {
      return res.status(400).json({ error: "No Assets found to remove" });
    }
    console.log(no);

    const updated = await locModel.updateOne(
      { _id: existingLoc._id },
      {
        $pull: {
          assets: { no: { $in: no } },
        },
      }
    );

    if (updated) {
      return res.status(200).json({ msg: "Assets removed successfully" });
    } else {
      return res
        .status(422)
        .json({ msg: "Couldnot remove assets from business location" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const removeAllLocationAssets = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existingLoc = await locModel.findOne({ id: id });
    if (!existingLoc) {
      return res.status(400).json({ error: "Location Tag doesnot exist" });
    }
    const updated = await locModel.findByIdAndUpdate(existingLoc._id, {
      assets: [],
    });
    if (updated) {
      return res.status(200).json({ msg: "Assets removed successfully" });
    } else {
      return res
        .status(422)
        .json({ msg: "Couldnot remove assets from business location" });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addLocation,
  updateBusinessLocation,
  allLocationTags,
  deleteLocationTag,
  addLocationAssets,
  removeLocationAssets,
  removeAllLocationAssets,
  getExcelTemplate,
};
