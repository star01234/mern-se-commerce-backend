const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrderSchema = new Schema(
  {
    email: { type: String, required: true },
    customerId: { type: String, required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true, default: 1 },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, required: true, default: "pending" },
    payment_status: { type: String, required: true, default: "unpaid" },
  },
  {
    timestamps: true,
  }
);

const CartModel = model("Order", OrderSchema);
module.exports = CartModel;
