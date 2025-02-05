const CartModel = require("../models/Cart");

exports.createCart = async (req, res) => {
  const { productId, name, price, image, quantity, email } = req.body;

  if (!productId || !name || !price || !image || !quantity || !email) {
    res.status(400).json({ message: "Product information is missing!" });
    return;
  }

  try {
    // Existing item in our cart
    const existingItem = await CartModel.findOne({productId,email});
    if(existingItem){
        existingItem.quantity += quantity;
        const data = await existingItem.save();
        return res.status(data);
    }
    //add item to cart for the first time
    const cart = new CartModel({
      productId,
      name,
      price,
      image,
      quantity,
      email,
    });

    const data = await cart.save();

    res.status(data);
  } catch (error) {
     res.status(500).send({
      message:
        error.message || "Something error occurred while updating a product",  
    })
  }
};
