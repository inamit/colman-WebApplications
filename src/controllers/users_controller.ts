import { Request, Response } from "express";
import { handleMongoQueryError } from "../db";
import User, { hashPassword } from "../models/users_model";
import token from "../utilities/token";
import bcrypt from "bcrypt";

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err: any) {
    console.warn("Error fetching users:", err);
    return handleMongoQueryError(res, err);
  }
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err: any) {
    console.warn("Error fetching user:", err);
    return handleMongoQueryError(res, err);
  }
};

const registerNewUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
      password,
    });

    const savedUser = await user.save();
    return res.json(savedUser);
  } catch (err: any) {
    console.warn("Error registering user:", err);
    return handleMongoQueryError(res, err);
  }
};

const updateUserById = async (req: Request, res: Response): Promise<any> => {
  const { user_id } = req.params;
  const updates = req.body;

  try {
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    const updatedUser = await User.findByIdAndUpdate(user_id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err: any) {
    console.warn("Error updating user:", err);
    return handleMongoQueryError(res, err);
  }
};

const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  const { user_id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(user_id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(deletedUser);
  } catch (err: any) {
    console.warn("Error deleting user:", err);
    return handleMongoQueryError(res, err);
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatchedpassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isMatchedpassword) {
      return res
        .status(400)
        .json({ error: "wrong credentials. Please try again." });
    }
    const { accessToken, refreshToken } = await token.generateTokens(
      existingUser
    );
    token.updateCookies(accessToken, refreshToken, res);
    return res.status(200).json({ message: "logged in successfully." });
  } catch (err) {
    console.warn("Error while logging in:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while logging in.", err });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    token.clearCookies(res);
    return res.status(200).json({ message: "logged out successfully." });
  } catch (err) {
    console.warn("Error while logging out:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while logging out.", err });
  }
};

export default {
  getAllUsers,
  getUserById,
  registerNewUser,
  updateUserById,
  deleteUserById,
  login,
  logout,
};
