import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v: any) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

export const hashPassword = async (password: any) => {
  const workFactor = 10;
  return await bcrypt.hash(password, workFactor);
};

const User = model("User", userSchema);

export default User;
