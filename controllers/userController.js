const userModel = require("../schema/userSchema");
const newUserModel = require("../schema/verifyUserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var fs = require("fs");
// const { generateOTP } = require("../services/otp");
// import generatePin from "pin-generator";
const pin = require("pin-generator");
const { default: pinGenerator } = require("pin-generator");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  // const otpGenerated = generateOTP();
  // const otpGenerated = (1000 + Math.random() * 9000).toFixed(0);
  const otpGenerated = pinGenerator(6);
  console.log("otp", otpGenerated);
  try {
    const existingUser = await newUserModel.findOne({ email: email });
    const verifiedUser = await userModel.findOne({ email: email });

    if (verifiedUser) {
      return res.status(422).json({ msg: "User already exists and verified" });
    }
    if (existingUser) {
      const diff = Math.floor(
        (new Date().getTime() - new Date(existingUser.created_at).getTime()) /
          1000
      );
      const timeLeft = 600 - diff;
      return res.status(422).json({
        msg: `${timeLeft} seconds left to get a new OTP`,
      });
    }
    const newUser = await newUserModel.create({
      email: email,
      password: password,
      otp: otpGenerated,
      created_at: Date.now(),
    });

    var transporter = nodemailer.createTransport({
      // service: "gmail",
      host: "s28.wpx.net",
      port: 465,
      // secure: false,
      auth: {
        user: "no-reply@offchainyield.com",
        pass: "OffChain@123",
      },
    });
    // var htmlstream = require("../components/emailFormat.html");
    var htmlstream = fs.createReadStream(
      "C:/Users/intag/Desktop/Trace-and-Track-Backend/components/emailFormat.html"
    );
    var url = `http://localhost:3000/verify/`;
    var mailOptions = {
      from: "no-reply@offchainyield.com",
      to: email,
      subject: "Account Verification OTP",
      html: `<html><body> <div style="text-align: center"> <h1 style="color: blue">Trace and Track</h1><p>OTP for trace n track application : ${otpGenerated}</p></div></body></html>`,
      text: "Verification email",
    };
    // console.log("Mail opt", mailOptions);
    // const sent = await transporter.sendMail(mailOptions);
    // console.log("Sent", sent);
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        return res.status(500).send({
          msg: "Technical Issue!, Please click on resend for verify your Email.",
        });
      }

      res.status(200).json({ msg: "An OTP has been sent to you via email" });
    });

    console.log(newUser);
  } catch (err) {
    next(err);
  }
};
const verifyOtp = async (req, res, next) => {
  const { fname, lname, country, email, password, cpassword, otp } = req.body;
  try {
    const createdUser = await newUserModel.findOne({ email: email });
    // const verifiedUser = await userModel.findOne({ email: email });

    // console.log("Verify", createdUser);
    if (createdUser) {
      const newUser = await validateUserSignUp(email, otp);
      console.log("Verification", newUser[0]);
      if (newUser[0] === true) {
        // const updatedUser = await newUserModel.findOne({
        //   email: email,
        // });
        const result = await userModel.create({
          fname: fname,
          lname: lname,
          email: email,
          country: country,
          password: password,
          cpassword: cpassword,
          active: true,
        });
        const token = jwt.sign(
          { email: email, id: result._id },
          process.env.SECRET_KEY
        );
        var transporter = nodemailer.createTransport({
          // service: "gmail",
          host: "s28.wpx.net",
          port: 465,
          // secure: false,
          auth: {
            user: "no-reply@offchainyield.com",
            pass: "OffChain@123",
          },
        });
        // var htmlstream = require("../components/emailFormat.html");
        var htmlstream = fs.createReadStream(
          "C:/Users/intag/Desktop/Trace-and-Track-Backend/components/emailFormat.html"
        );
        var url = `http://localhost:3000/verify/`;
        var mailOptions = {
          from: "no-reply@offchainyield.com",
          to: email,
          subject: "Trace and Track App Successfully Registered",
          html: `<html><body> <div style="text-align: center"> <h1 style="color: blue">Trace and Track</h1><p>You have successfully registered to Trace and Track</p></div></body></html>`,
          text: "Verification email",
        };
        // console.log("Mail opt", mailOptions);
        // const sent = await transporter.sendMail(mailOptions);
        // console.log("Sent", sent);
        transporter.sendMail(mailOptions, async function (err) {
          if (err) {
            return res.status(500).send({
              msg: "Technical Issue!, Please click on resend for verify your Email.",
            });
          }
          const verifiedUser = await newUserModel.findOne({ email: email });
          console.log("Verified User", verifiedUser);
          await newUserModel.findByIdAndDelete({ _id: verifiedUser._id });
          res
            .cookie("jwtToken", token, {
              httpOnly: true,
              // secure: true,
              // sameSite: true,
              // secure: false,
              expires: new Date(Date.now() + 900000),
              // httpOnly: true,
            })
            .status(200)
            .json({
              msg: "User verified, Verification email has been sent to user ",
              token: token,
            });
        });
      } else {
        return res.status(400).send({ msg: newUser[1] });
      }
    } else {
      return res
        .status(400)
        .send({ msg: "user already verified or not found" });
    }

    // return res.status(400).send({ msg: "user not found " });
    // if (createdUser) {
    //   if (createdUser.isVerified === true) {
    //     return res.status(422).json({ msg: "User already verified" });
    //   } else if (createdUser.isVerified === false) {
    //     const newUser = await validateUserSignUp(email, otp);
    //     console.log("Verification", newUser[1]);
    //     if (newUser[0] === true) {
    //       const updatedUser = await newUserModel.findOne({
    //         email: email,
    //       });
    //       const result = await userModel.create({
    //         fname: fname,
    //         lname: lname,
    //         email: email,
    //         country: country,
    //         password: password,
    //         cpassword: cpassword,
    //         active: true,
    //       });
    //       const token = jwt.sign(
    //         { email: email, id: result._id },
    //         process.env.SECRET_KEY
    //       );
    //       var transporter = nodemailer.createTransport({
    //         // service: "gmail",
    //         host: "s28.wpx.net",
    //         port: 465,
    //         // secure: false,
    //         auth: {
    //           user: "no-reply@offchainyield.com",
    //           pass: "OffChain@123",
    //         },
    //       });
    //       // var htmlstream = require("../components/emailFormat.html");
    //       var htmlstream = fs.createReadStream(
    //         "C:/Users/intag/Desktop/Trace-and-Track-Backend/components/emailFormat.html"
    //       );
    //       var url = `http://localhost:3000/verify/`;
    //       var mailOptions = {
    //         from: "no-reply@offchainyield.com",
    //         to: email,
    //         subject: "Trace and Track App Successfully Registered",
    //         html: `<html><body> <div style="text-align: center"> <h1 style="color: blue">Trace and Track</h1><p>You have successfully registered to Trace and Track</p></div></body></html>`,
    //         text: "Verification email",
    //       };
    //       // console.log("Mail opt", mailOptions);
    //       // const sent = await transporter.sendMail(mailOptions);
    //       // console.log("Sent", sent);
    //       transporter.sendMail(mailOptions, async function (err) {
    //         if (err) {
    //           return res.status(500).send({
    //             msg: "Technical Issue!, Please click on resend for verify your Email.",
    //           });
    //         }
    //         const verifiedUser = await newUserModel.findOne({ email: email });
    //         console.log("Verified User", verifiedUser);
    //         await newUserModel.findByIdAndDelete({ _id: verifiedUser._id });
    //         return res.status(200).json({
    //           msg: "User verified, Verification email has been sent to user ",
    //           token: token,
    //         });
    //       });
    //     } else {
    //       return res
    //         .status(400)
    //         .json({ msg: "User not verified, invalid OTP", user: newUser[1] });
    //     }
    //   }
    // } else {
    //   res.status(400).json({ msg: "User not found" });
    // }
  } catch (err) {
    next(err);
  }
};
const validateUserSignUp = async (email, otp) => {
  const user = await newUserModel.findOne({
    email,
  });
  console.log(user);
  if (!user) {
    return [false, "User not found"];
  }
  if (user && user.otp !== otp) {
    return [false, "Invalid OTP"];
  }
  // const updatedUser = await newUserModel.findByIdAndUpdate(user._id, {
  //   $set: { isVerified: true },
  // });

  return [true];

  // return [true, updatedUser];
};
const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(422).json("Please enter email and password");
    }

    const userLogin = await userModel.findOne({ email: email });
    console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      console.log("Match", isMatch);
      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        const logintoken = await userLogin.generateAuthToken();
        console.log("Token", logintoken);
        res.cookie("jwtToken", logintoken, {
          // httpOnly: true,
          // secure: true,
          // sameSite: true,
          // secure: false,
          expires: new Date(Date.now() + 900000),
          // httpOnly: true,
        });
        return (
          res
            .status(200)
            // .cookie("jwtToken", logintoken, {
            //   // httpOnly: true,
            //   // secure: true,
            //   // sameSite: true,
            //   // secure: false,
            //   expires: new Date(Date.now() + 900000),
            //   // httpOnly: true,
            // })
            .json({
              msg: `Login Successful`,
              token: logintoken,
            })
        );
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {}
};
const verifyEmail = async (req, res, next) => {
  // res.send("Verify");
  const { token } = req.params;
  console.log("Token inside verify", token);

  // Verifying the JWT token

  jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send(
          "Email verification failed, possibly the link is invalid or expired"
        );
    } else {
      const user = await userModel.findOne({ _id: decoded._id });
      console.log("User found", user, token._id);
      if (user) {
        const updatedUser = await userModel.findByIdAndUpdate(
          { _id: token._id },
          { ...user, isVerified: true },
          { runValidators: true }
        );
        console.log("Updated user", updatedUser);
        // userModel.update({ _id: token._id }, { $set: { isVerified: true } });
        res.status(200).send("Email verifified successfully");
      } else {
        res.status(400).send("Could not find user");
      }
    }
  });
};

module.exports = { signup, signin, verifyOtp };
