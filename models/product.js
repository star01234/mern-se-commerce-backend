const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    image: { type: String, require: true },
    category: { type: String },
  },
  { timestamps: true }
); // เพิ่ม timestamps ที่นี่

const ProductModel = model("Product", ProductSchema);
module.exports = ProductModel;
