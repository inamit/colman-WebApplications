const User = require('../models/users_model');
const token = require('../utilities/token');
const bcrypt = require("bcrypt");


const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err) {
        console.warn("Error fetching users:", err);
        return res.status(500).json({ error: "An error occurred while fetching the users." });
      }
  };
  
const registerNewUser = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const user = new User({
      username,
      email,
      password
    });

    const savedUser = await user.save();
    return res.json(savedUser);
  } catch (err) {
    console.warn("Error registering user:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "username already exsits."});
    } else if (err._message === "User validation failed") {
      return res.status(400).json({ error: "email is not valid. Please enter valid email address"});
    } else {
      return res.status(500).json({ error: "An error occurred while registering the user."});
    }
  }
};

const login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const existingUser = await User.findOne({username});
    const isMatchedpassword = await bcrypt.compare(password, existingUser?.password);
    if (!isMatchedpassword) {
      return res.status(400).json({ error: "wrong credentials. Please try again."});
    }
    const {accessToken, refreshToken} = await token.generateTokens(existingUser);
    token.updateCookies(accessToken, refreshToken, res);
    return res.status(200).json({message: "logged in successfully."});
  } catch (err) {
    console.warn("Error while logging in:", err);
    return res.status(500).json({ error: "An error occurred while logging in.", err});
  }
}

const logout = async (req, res) => {
  try{
    token.clearCookies(res);
    return res.status(200).json({message: "logged out successfully."});
  } catch {
    console.warn("Error while logging out:", err);
    return res.status(500).json({ error: "An error occurred while logging out.", err});
  }
}

module.exports = {getAllUsers, registerNewUser, login, logout};