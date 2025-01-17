const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
const secret = process.env.SECRET

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide all required fields!",
    });
    return;
  }

  try {
    const hashesPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      username,
      password: hashesPassword,
    });
    res.send({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Something error occurred while registering a new user",
    });
  }
};

// ฟังก์ชันเข้าสู่ระบบผู้ใช้
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบว่าข้อมูลครบถ้วน
  if (!username || !password) {
     res.status(400).send({
      message: "Please provide username and password!",
    });
    return;
  }

  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      res.status(404).send({
        message: "User not found!",
      });
      return; 
    }

    const isPasswordMatched = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordMatched) {
       res.status(401).send({
        message: "Invalid credentials",
      });
      return;
    }

    // login success
    jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
      if (err) {
        return res.status(500).send({
          message: "Internal server error: Authentication failed!",
        });
      }

      // token
      res.send({
        message: "User logged in successfully",
        id: userDoc._id,
        username,
        accessToken: token,
      });
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while logging in user",
    });
  }
};
