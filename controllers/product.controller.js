const ProductModel = require("../models/product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.createProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }
  const firebaseUrl = req.file?.firebaseUrl;
  const { name, description, price, image, category } = req.body;

  // Validate input fields
  if (!name || !description || !price || !image || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create product
    const productDoc = await ProductModel.create({
      name,
      description,
      price,
      image: firebaseUrl,
      category,
    });

    if (!productDoc) {
      return res.status(404).send({
        message: "Can't create product",
      });
    }

    res.json(productDoc);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const productDoc = await ProductModel.find()
      .sort({ createdAt: -1 }) // Corrected field name from `createAt` to `createdAt`
      .limit(20);

    if (!productDoc || productDoc.length === 0) {
      return res.status(404).send({
        message: "Can't get products",
      });
    }

    res.json(productDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while getting products",
    });
  }
};

exports.getProductsById = async (req, res) => {
  const { id } = req.params;

  try {
    const productDoc = await ProductModel.findById(id).populate("author", [
      "username",
    ]);

    if (!productDoc) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    res.json(productDoc);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message:
        error.message ||
        "Something error occurred while getting Product Details",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productDoc = await ProductModel.findById(id);
    if (!productDoc) {
      return res.status(404).send({
        message: "Product not found",
      });
    }
    await ProductModel.findByIdAndDelete(id);
    res.status(200).send({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: error.message || "An error occurred while deleting the product",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ message: "Product id is not provided" });
  }

  try {
    const productDoc = await ProductModel.findById(id);

    if (!productDoc) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    const { name, description, price, image, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    productDoc.name = name;
    productDoc.description = description;
    productDoc.price = price;
    productDoc.category = category;

    if (req.file) {
      productDoc.image = req.file.firebaseUrl; // Update image if provided
    }

    await productDoc.save();

    res.json(productDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while updating the product",
    });
  }
};
