const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/errorHandler");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [
      true,
      "Fullname not provided. Cannot create user without Fullname ",
    ],
    trim: true,
  },
  lname: {
    type: String,
    required: [
      true,
      "Username not provided. Cannot create user without Username ",
    ],
    trim: true,
  },
  country: {
    type: String,
    required: [
      true,
      "Country not provided. Cannot create user without Country ",
    ],
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    lowercase: true,
    trim: true,
    required: [true, "Email not provided. Cannot create user without email "],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },

  password: {
    type: String,
    notEmpty: true,
    required: true,
    // minlength: [8, "Password is less than 8 characters"],
    // isLength: {
    //   options: { min: 8 },
    //   message: "Password is less than 8 characters",
    // },
    validate: {
      validator: function (pwd) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
          pwd
        );
      },
      message: "{VALUE} is not a valid password!",
    },
  },
  cpassword: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match.",
    },
  },
  active: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // this.tokens = this.tokens.concat({ token: token });
    // await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("users", userSchema);
