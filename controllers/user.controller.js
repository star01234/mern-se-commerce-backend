const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
const secret = process.env.SECRET

exports.sign = async (req, res) => {
  const { email } = req.body
  //check email is existing in DB?
  if(!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const user = await UserModel.findOne({email});
  if(!user){
    return res.status(404).json({ message: "Email not found" });
  }
  //SignJWT Token
  const Token = jwt.sign({ email: user.email, role: user.role }, 
    process.env.SECRET,{
      expiresIn: "1h",
    }
  );
  res.status(200).json({ Token });
};

exports.addUser = async (req, res) => {
  const {email} = req.body;
  if(!email){
    return res.status(400).json({ message: "Email is required" });
  }
  try{
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already existed" });
    }
    const user = new UserModel({ email });
    await user.save();
    res.status(201).json(user);
  }catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}