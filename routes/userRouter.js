var express = require("express");
var router = express.Router();
const { signup, signin, verifyOtp } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.get("/about", validateToken, function (req, res, next) {
  res.send("About");
});
// router.get("/verify/:token", verify);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verifyOtp", verifyOtp);

// router.get("/signin", signin);

module.exports = router;
