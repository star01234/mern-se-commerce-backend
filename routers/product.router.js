const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { upload } = require("../middlewares/file.middlewares");
const authJwt = require("../middlewares/authJwt.middleware");
//http://localhost:5000/api/v1/product
router.post("", upload, productController.createProduct);
router.get("", productController.getProducts);
router.get("/:id",productController.getProductsById);
router.delete("/:id",authJwt.verifyToken, productController.deleteProduct);
router.put("/:id", authJwt.verifyToken, upload, productController.updateProduct);

module.exports = router;