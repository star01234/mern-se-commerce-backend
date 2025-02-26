const ProductModel = require("../models/Product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

// Middleware สำหรับตรวจสอบ Token
verifyToken = (req, res, next) => {
  const token = req.header("x-access-token"); // รับ token จาก header
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Access Forbidden" });
    req.role = decoded.role;
    req.email = decoded.email;
    next();
  });
};

isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "require admin Role!" });
  }
  next();
}

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;
