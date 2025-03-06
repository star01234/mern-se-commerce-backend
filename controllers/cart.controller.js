const CartModel = require("../models/Cart");
/**
 * @swagger
 * /cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Create or Update a Cart Item
 *     description: Adds a new item to the cart or updates the quantity if the item already exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Unique identifier for the product
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *               image:
 *                 type: string
 *                 description: URL or path to the product image
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product to add to the cart
 *               email:
 *                 type: string
 *                 description: User's email for cart association
 *             required:
 *               - productId
 *               - name
 *               - price
 *               - image
 *               - quantity
 *               - email
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       '400':
 *         description: Bad Request - Missing product information
 *       '500':
 *         description: Server error
 */
exports.createCart = async (req, res) => {
  console.log("Request Body:", req.body);
  const { productId,name, price, image, quantity, email } = req.body;
  if ( !productId || !name || !price || !image || !quantity || !email) {
    res.status(400).send({
      message: "Product information is missing!",
    });
    return;
  }
  try {
    //Existing item in our cart =
    const ExistingItem = await CartModel.findOne({
      productId,
      email,
    });
    if (ExistingItem) {
      ExistingItem.quantity += quantity;
      const data = await ExistingItem.save();
      return res.send(data);
    }
    //add item to cart for the first time
    const cart = await CartModel.create({
      productId,
      name,
      price,
      image,
      quantity,
      email,
    });
    const data = await cart.save();
    res.send(data);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send({
      message:
        error.message ||
        "Something error occurred while creating a new cart Item.",
    });
  }
};
/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get All Cart Items
 *     description: Retrieves all items in all carts
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       '400':
 *         description: No items in cart
 *       '500':
 *         description: Server error
 */
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartModel.find();
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
    res.json(cartItems);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while getting cart items",
    });
  }
};
/**
 * @swagger
 * /cart/{email}:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get Cart Items by Email
 *     description: Retrieves all items in the cart for a specific email
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email address associated with the cart
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       '400':
 *         description: No items in cart or email missing
 *       '500':
 *         description: Server error
 */
exports.getCartItemsByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    res.status(400).json({ message: "Email is Missing" });
    return;
  }
  try {
    const cartItems = await CartModel.find({ email });
    if (!cartItems) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
    res.json(cartItems);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while getting cart items",
    });
  }
};
/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update Cart Item
 *     description: Updates the quantity of an existing cart item
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cart item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity for the cart item
 *             required:
 *               - quantity
 *     responses:
 *       '200':
 *         description: Successful update
 *       '400':
 *         description: Bad Request - Missing quantity
 *       '500':
 *         description: Server error
 */
exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartModel.findById(id);
    const { quantity } = req.body;
    if (!quantity) {
      return res
        .status(400)
        .json({ message: "Product information is missing!" });
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({ message: "Update cart item successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Something error occurred while updating cart item!",
    });
  }
};
/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Delete Cart Item
 *     description: Removes a specific item from the cart
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cart item to delete
 *     responses:
 *       '200':
 *         description: Cart item deleted successfully
 *       '404':
 *         description: Cart item not found
 *       '500':
 *         description: Server error
 */
exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartModel.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Something error occurred while deleting cart item by email!",
    });
  }
};
/**
 * @swagger
 * /cart/clear/{email}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Clear All Items for an Email
 *     description: Removes all items from the cart associated with the email
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email address associated with the cart
 *     responses:
 *       '200':
 *         description: Cart cleared successfully
 *       '400':
 *         description: Email missing or no items to clear
 *       '500':
 *         description: Server error
 */
exports.clearAllItem = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: "Email is missing" });
  }
  try {
    const cart = await CartModel.deleteMany({ email });
    if (cart.deletedCount === 0) {
      return res.status(404).json({ message: "Not have any item to clear" });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Something error occurred while clearing shopping items",
    });
  }
};
