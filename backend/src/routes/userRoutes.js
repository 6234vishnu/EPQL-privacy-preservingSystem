import express from "express";
import { findAddress } from "../controllers/user/activitiesController.js";
import {
  userSignUp,
  Loginuser,
  Getuserprofile,
  GoogleLogin,
  updateUserProfile,
  getUserDetails,
  logoutUser,
} from "../controllers/user/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const userRouter = express.Router();
import passport from "passport";

userRouter.post("/userSignUp", userSignUp);
userRouter.post("/login", Loginuser);
userRouter.post("/logout", verifyToken, logoutUser);
userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get("/getUser", verifyToken, Getuserprofile);
userRouter.get("/google/callback", GoogleLogin);
userRouter.post("/find/address", verifyToken, findAddress);
userRouter.patch("/update/profile", verifyToken, updateUserProfile);
userRouter.post("/authenticateUser", verifyToken, getUserDetails);

export default userRouter;
