const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { upload, uploadToFirebase } = require("../middlewares/file.middlewares");
const authJwt = require("../middlewares/authJwt.middleware");
// http://localhost:5000/api/v1/product
router.post("", upload, uploadToFirebase, productController.createProduct);
// http://localhost:5000/api/v1/product
router.get("", productController.getProduct);
// http://localhost:5000/api/v1/product/
router.get("/:id", productController.getProductByID);
// http://localhost:5000/api/v1/product/
router.delete("/:id", productController.deleteProduct);
// http://localhost:5000/api/v1/product/676ba46f2cc93f45c000f3dd
router.put("/:id", upload, uploadToFirebase, productController.updateProduct);
module.exports = router;
