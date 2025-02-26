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

exports.getAllUser = async (req, res) => {
  try {
    const user = await UserModel.find();
    if (!user) {
      return res.status(200).send({
        message: "Can't get user",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error occurred while getting user",
    });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { email, role },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error occurred while updating user",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User was delete successfully" });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error occurred while deleting user",
    });
  }
};

exports.makeAdmin = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.role = "admin";
    user.save();
    res.json(user);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Something error occurred while changing user role to admin",
    });
  }
};

exports.makeUser = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.role = "user";
    user.save();
    res.json(user);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Something error occurred while changing admin role to user",
    });
  }
};

exports.getRoleByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ role: user.role });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error occurred while user role",
    });
  }
};
