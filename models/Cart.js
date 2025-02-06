const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CartSchema = new Schema({
  name: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  email: { type: String, require: true },
  price: { type: Number, require: true },
  image: { type: String, require: true },
  quantity: { type: Number, require: true },
});

const CartModel = model("Cart", CartSchema);
module.exports = CartModel;
