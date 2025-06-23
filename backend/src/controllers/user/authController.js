import { usermodel } from "../../models/userSchema.js";
import "../../auth/passport.js";
import passport from "passport";
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await usermodel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = new usermodel({
      name,
      email,
      password,
    });

    const savedUser = await user.save();

    if (!savedUser) {
      return res.status(500).json({
        success: false,
        message: "Couldn't create user, try again later.",
      });
    }
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (savedUser.isAdmin === true) {
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        admin: savedUser,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// User Login
export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user?.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (user?.isAdmin === true) {
      return res.status(200).json({
        success: true,
        admin: true,
        message: "Login successfully",
        admin: user,
      });
    }

    return res.status(200).json({
      success: true,
      user: true,
      message: "Login successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const Getuserprofile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await usermodel.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const GoogleLogin = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend
      const isAdmin = user.isAdmin;
      const redirectUrl = isAdmin
        ? `${process.env.FRONTEND_URL}/admin/dashboard`
        : `${process.env.FRONTEND_URL}/`;

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("Google login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
];

export const updateUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await usermodel.findById(decoded.id);
    const { email, name } = req.body;

    const updateUser = await usermodel.findByIdAndUpdate(
      user._id,
      { $set: { name, email } },
      { new: true }
    );
    if (!updateUser) {
      return res.status(500).json({ success: false, message: "server error " });
    }
    return res
      .status(200)
      .json({ success: true, message: "updated successfully" });
  } catch (error) {
    console.log("error in update profile ", error);
    return res
      .status(500)
      .json({ success: false, message: "Unauthorized - No token found" });
  }
};
