const ProductModel = require("../models/Product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.createProduct = async (req, res) => {
    //const {path: import} = req.file;
    const category = req.userId;
    const {name, description, price} = req.body

    if(!name || !description || !price) { 
        return res.status(400).json({message:"All Fields is required"});
    }
    
    const productDoc = await ProductModel.create({
        name,
        description, 
        price, 
//        import,
        category});
    res.json(productDoc);
}

exports.getProducts = async (req, res) => {
    const products = await ProductModel.find()
    .sort({ createAt: -1 })
    .limit(20)
res.json(products);
};

exports.getProductsById = async (req, res) => {
    const { id } = req.params;
    const productDoc = await ProductModel.findById(id).populate ("auther", ["username"]);
    res.json(productDoc);
}

exports.deleteProduct = async (req, res) => {
    const {id} = req.params;
    const categoryId = req.userId;
    try {
        const productDoc = await ProductModel.findById(id)
        if(categoryId !== productDoc.category.toString()) {
            res.status(403).send({
                message: "You cannot delete this product",
            });
            return;
        }
        await productDoc.deleteOne();
        res.json(productDoc);
    } catch (error) { 
        res.status(500).send({
            message: error.message || "Something error occurred while deleting a product",
        });
    };
}

exports.updateProduct = async (req,res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Product id is not provided" });
  const categoryId = req.userId;
  try {
    const productDoc = await ProductModel.findById(id);
    if (categoryId !== productDoc.category.toString()) {
      res.status(403).send({
        message: "You cannot update this product",
      });
      return;
    }
    const { path } = req.file
    const {name, description, price} = req.body;
    if (!name || !description || !price) {
        return res.status(400).json({ message: "All Fields is required" });
    }
    productDoc.name = name;
    productDoc.description = description;
    productDoc.price = price;
    if (req.file) {
        const { path } = req.file;
        productDoc.import = path;
    }
    await productDoc.save();
    res.json(productDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while updating a product",
    });
  }
}