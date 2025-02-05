const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const productModel = mongoose.models.product || model("product", productSchema);
module.exports = productModel;
