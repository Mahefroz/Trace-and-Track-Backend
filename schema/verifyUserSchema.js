const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const errorHandler = require("../middleware/errorHandler");

const verifyUserSchema = new mongoose.Schema(
  {
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
      validate: {
        validator: function (pwd) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            pwd
          );
        },
        message: "{VALUE} is not a valid password!",
      },
    },
    otp: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now(),
      expires: 600,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

verifyUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

verifyUserSchema.index({ created_at: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("newUser", verifyUserSchema);
