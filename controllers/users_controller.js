const User = require('../models/users_model');

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
        console.warn("Error fetching users:", err);
        res.status(500).json({ error: "An error occurred while fetching the users." });
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
    res.json(savedUser);
  } catch (err) {
    console.warn("Error registering user:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "username already exsits."});
    } else if (err._message === "User validation failed") {
      res.status(400).json({ error: "email is not valid. Please enter valid email address"});
    } else {
      res.status(500).json({ error: "An error occurred while registering the user."});
    }
  }
};

module.exports = {getAllUsers, registerNewUser};