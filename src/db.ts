import { Response } from "express";
import { MongoError } from "mongodb";
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
};

export const handleMongoQueryError = (
  res: Response,
  err: MongoError | mongoose.Error
): Response => {
  const duplicateKeyErrorCode = 11000;

  if (err instanceof MongoError && err?.code === duplicateKeyErrorCode) {
    return res.status(400).json({ error: "Resource already exist" });
  } else if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "An error occurred." });
  }
};
