const categoryModel = require("../schema/categorySchema");
const prodModel = require("../schema/productDetailSchema");
const fs = require("fs");

const addProduct = async (req, res, next) => {
  const { id, products } = req.body;
  try {
    existingCategory = await categoryModel.findOne({
      id: id,
    });
    console.log("existing category", existingCategory);
    if (!existingCategory) {
      return res.status(422).json({ error: "Catgeory doesnot exist" });
    }
    existingProd = await prodModel.findOne({ categoryId: id });

    console.log("existing prod", existingProd);
    if (existingProd) {
      if (existingProd.products.some((item) => products.includes(item))) {
        return res
          .status(422)
          .json({ error: "Some or all products already exists" });
      } else {
        const updated = await prodModel.updateOne(
          { _id: existingProd._id },
          {
            $push: {
              products: products,
            },
          }
        );
        if (updated) {
          return res
            .status(200)
            .json({ msg: "Products added successfully", data: existingProd });
        } else {
          return res.status(422).json({ error: "Products could not be added" });
        }
      }
    } else if (!existingProd) {
      const result = await prodModel.create({
        categoryId: id,
        products: products,
      });
      return res
        .status(200)
        .json({ msg: "Products added successfully", data: result });
    }
  } catch (err) {
    next(err);
  }
};
const allProducts = async (req, res, next) => {
  try {
    const allProducts = await prodModel.find({});
    // let products = [];
    // allProducts.map((row) => row.products.map((p) => products.push(p)));

    // console.log("all", allProducts);
    if (allProducts) {
      return res
        .status(200)
        .json({ msg: "Products found successfully", data: allProducts });
    } else {
      return res.status(400).json({ error: "No Products found" });
    }
  } catch (err) {
    next(err);
  }
};
const getCategoryProducts = async (req, res, next) => {
  const { categoryId } = req.body;
  console.log(categoryId);
  try {
    const allProducts = await prodModel.findOne({ categoryId: categoryId });
    console.log("all", allProducts);
    if (allProducts) {
      return res
        .status(200)
        .json({ msg: "Products found successfully", data: allProducts });
    } else {
      return res.status(400).json({ error: "No Products found" });
    }
  } catch (err) {
    next(err);
  }
};
const deleteSingleProduct = async (req, res, next) => {
  const { categoryId, product } = req.body;
  try {
    const existingProdCat = await prodModel.findOne({ categoryId: categoryId });
    if (!existingProdCat) {
      return res.status(400).json({ error: "Category doesnot exist" });
    }
    console.log(existingProdCat.products);
    const existingProd = existingProdCat.products.includes(product);
    const updated = await prodModel.updateOne(
      { _id: existingProdCat._id },
      {
        $pull: {
          products: { $in: product },
        },
      }
    );
    if (updated) {
      return res.status(200).json({ msg: "Product removed successfully" });
    } else {
      return res
        .status(422)
        .json({ msg: "Couldnot remove product from category" });
    }

    console.log(existingProd);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addProduct,
  allProducts,
  getCategoryProducts,
  deleteSingleProduct,
};
