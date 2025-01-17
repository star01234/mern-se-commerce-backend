const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  import: { type: String, require: true },
  category: { type: Schema.Types.ObjectId, ref: "User" },
});

const productModel = model("product", productSchema);
module.exports = productModel;
