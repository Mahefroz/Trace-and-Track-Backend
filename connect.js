// Import the mongoose module
const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
// const mongoDB = "mongodb+srv://mahefrozeshaheen:Mahefroze@itlp871@cluster0.vxztguu.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose
    .connect(
      //  "mongodb+srv://abdullahsheikh1296:S7I60UKgNXKCzqCR@cluster0.gttql5y.mongodb.net/Library?retryWrites=true&w=majority",
      // "mongodb+srv://mahefroze:maha123@cluster0.vxztguu.mongodb.net/Library?retryWrites=true&w=majority",
      "mongodb+srv://mahefrozeshaheen:tracetrack123@cluster0.7amvukb.mongodb.net/TracenTrack?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((con) =>
      console.log(
        `Database running on Host: ${con.connection.host} at PORT ${con.connection.port}`
      )
    )
    .catch((err) => console.log(err));
};

// Wait for database to connect, logging an error if there is a problem

module.exports = { connectDB };
