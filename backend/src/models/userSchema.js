import mongoose from "mongoose";

const userscheama = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  isAdmin: { type: Boolean, default: false },
  picture: { type: String },
});

export const usermodel = mongoose.model("user", userscheama);
