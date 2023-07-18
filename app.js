var path = require("path");
var cookieParser = require("cookie-parser");
const env = require("dotenv");
var express = require("express");
const cors = require("cors");
var logger = require("morgan");
var multer = require("multer");

const error = require("./middleware/errorHandler");

var { connectDB } = require("./connect");
var app = express();
connectDB();

app.use(cookieParser());
env.config({ path: "./config.env" });

var userRouter = require("./routes/userRouter");
var productRouter = require("./routes/productRouter");
var locationRouter = require("./routes/locRouter");
var assetRouter = require("./routes/assetRouter");
var categoryRouter = require("./routes/categoryRouter");
const productDetailRouter = require("./routes/productDetailRouter");
const businessRouter = require("./routes/businessRouter");
const assetDetailRouter = require("./routes/assetDetailRouter");
const templateRouter = require("./routes/templateRouter");
const assetCategoryRouter = require("./routes/assetCategoryRouter");
const categoryDataRouter = require("./routes/categoryDataRouter");

app.use(logger("dev"));
app.use(express.json());

// app.use(multer({ storage: fileStorage, fileFilter }).single("img"));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    // origin: "http://192.168.1.98",
    // Access-Control-Allow-Origin: "http://192.168.1.98",
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://192.168.1.98:5173",
    ],
  })
);

app.use("/", userRouter);
app.use("/product", productRouter);
app.use("/location", locationRouter);
app.use("/asset", assetRouter);
app.use("/category", categoryRouter);
app.use("/productDetail", productDetailRouter);
app.use("/business", businessRouter);
app.use("/assetDetail", assetDetailRouter);
app.use("/template", templateRouter);
app.use("/assetCategory", assetCategoryRouter);
app.use("/categoryData", categoryDataRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use(error);
module.exports = app;
