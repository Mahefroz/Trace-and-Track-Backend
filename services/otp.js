const otpGenerator = require("otp-generator");
module.exports.generateOTP = () => {
  console.log(process.env.OTP_LENGTH);

  const OTP = otpGenerator.generate(process.env.OTP_LENGTH, {
    digits: true,
    // upperCaseAlphabets: true,
    specialChars: false,
  });
  return OTP;
};

// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like
