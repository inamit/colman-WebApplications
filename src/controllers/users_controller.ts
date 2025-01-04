import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import * as token from '../utilities/token';
import User, { IUser } from '../models/users_model';


export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
      const users : IUser[] | null= await User.find();
      return res.status(200).json(users);
    } catch (err) {
        console.warn("Error fetching users:", err);
        return res.status(500).json({ error: "An error occurred while fetching the users." });
      }
  };
  
export const registerNewUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const {username, email, password} = req.body;
    const user = new User({
      username,
      email,
      password
    });

    const savedUser : IUser= await user.save();
    return res.status(200).json(savedUser);
  } catch (err: any) {
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

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const {username, password} : {username: string, password: string}= req.body;
    const existingUser: IUser | null = await User.findOne({username});
    if (existingUser) {
      const isMatchedpassword : boolean = await bcrypt.compare(password, existingUser?.password);
      if (!isMatchedpassword) {
        return res.status(400).json({ error: "wrong credentials. Please try again."});
      }
    } else {
      return res.status(400).json({ error: "wrong credentials. Please try again."});
    }
    const {accessToken, refreshToken}: { accessToken: string; refreshToken: string }  = await token.generateTokens(existingUser);
    token.updateHeaders(accessToken, refreshToken, res);
    return res.status(200).json({message: "logged in successfully."});
  } catch (err) {
    console.warn("Error while logging in:", err);
    return res.status(500).json({ error: "An error occurred while logging in.", err});
  }
}

export const logout = async (req: Request, res: Response): Promise<any> => {
  try{
    token.clearHeaders(res);
    return res.status(200).json({message: "logged out successfully."});
  } catch (err) {
    console.warn("Error while logging out:", err);
    return res.status(500).json({ error: "An error occurred while logging out.", err});
  }
}