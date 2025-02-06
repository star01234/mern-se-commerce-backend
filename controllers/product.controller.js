const ProductModel = require("../models/Product");
Model = require("../models/Product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.createProduct = async (req, res) => {
  /**
    #swagger.tags = ['Product']
    #swagger.summary = "Create a new product"
    #swagger.description = 'Endpoint to create a new product'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['file'] = {
       in:'formData',
       type:'file',
       required:true,
       description:'Image to upload to Firebase Storage and get its url'
    }
    #swagger.requestBody = {
       required:true,
       content:{
         "multipart/form-data":{
           schema:{
             $ref:"#components/schemas/NewProduct"
           }
         }
       }
    }
    #swagger.response[200] = {
       schema:{ "$ref": "#components/schemas/ProductResponse"},
       description: "Product created successfully"
    }
   */
  //File upload

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const firebaseUrl = req.file.firebaseUrl;

  const { name, description, category, price } = req.body;
  if (!name || !description || !category || !price) {
    return res.status(400).json({ message: "All Fields is requires" });
  }

  try {
    const productDoc = await ProductModel.create({
      name,
      description,
      category,
      price,
      image: firebaseUrl,
    });
    if (!productDoc) {
      res.status(400).send({
        message: "Cannot create new product!",
      });
      return;
    }
    res.json(productDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Something error occurred while creating a new product.",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await ProductModel.find();
    //SELECT * FROM  POST, USER WHERE POST.author = USER._id
    if (!products.length) {
      res.status(404).send({
        message: "Product not found!",
      });
      return;
    }
    res.json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Something error occurred while getting product detail",
    });
  }
};

exports.getProductByID = async (req, res) => {
  const { id } = req.params;
  try {
    const productDoc = await ProductModel.findById(id);
    if (!productDoc) {
      res.status(404).send({
        message: "Product not found!",
      });
      return;
    }
    res.json(productDoc);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Something error occurred while getting product detail",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const productDoc = await ProductModel.findById(id);
    if (authorId !== productDoc.author.toString()) {
      res.status(403).send({
        message: "You are not allowed to delete this product!",
      });
      return;
    }
    await productDoc.deleteOne();
    res.json(productDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while deleting a product.",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({ message: "Product id is not Provided" });
  try {
    const productDoc = await ProductModel.findById(id);
    if (!productDoc) {
      res.status(404).json({ message: "You Cannnot update this product" });
      return;
    }

    const { name, category, description, price } = req.body;
    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    productDoc.name = name;
    productDoc.category = category;
    productDoc.description = description;
    productDoc.price = price;

    if (req.file) {
      productDoc.image = req.file.firebaseUrl;
    }

    await productDoc.save();
    res.status(200).json(productDoc);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message:
        error.message || "Something error occurred while updating the product.",
    });
  }
};
