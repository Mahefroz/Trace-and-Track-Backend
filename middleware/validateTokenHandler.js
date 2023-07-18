const jwt = require("jsonwebtoken");
const userModel = require("../schema/userSchema");
const validateToken = async (req, res, next) => {
  const { jwtToken } = req.cookies;
  const { id } = req.body;
  console.log("Token from cookie", jwtToken, id);
  if (!jwtToken) {
    return res.status(401).json("User is not authorized or token is missing");
  }

  await jwt.verify(jwtToken, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json("User is not authorized");
    }
    console.log("Decoded", decoded._id);
    const user = await userModel.findOne({ _id: decoded._id });
    console.log("User info", user);
    if (user) {
      next();
    } else {
      return res.status(401).json("User is not authorized");
    }
  });
};

module.exports = validateToken;
