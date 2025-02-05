const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CartSchema = new Schema({
  productID: { type: Schema.Types.ObjectId, ref: "Product", require: true },
  name: { type: String, require: true },
  email: { type: String, require: true },
  image: { type: String, require: true },
  price: { type: Number, require: true },
  quantity: { type: Number, require: true },
},{
  timeseries: true,
}
);

const cartModel = model("Cart", CartSchema);
module.exports = cartModel;
