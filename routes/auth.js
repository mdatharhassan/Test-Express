import express from "express";
import { loginUser, registerUser } from "../controller/authController.js";
import { body } from "express-validator";
import User from "../model/userModel.js";
import userAuth from "../middleware/auth.js";
import { hashPassword } from "../utils/hashPassword.js";
import upload from "../middleware/upload.js";
import { imageUpload } from "../config/cloudinary.js";

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  // Login logic here
  loginUser
);

authRouter.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],

  // Registration logic here
  registerUser
);

authRouter.get("/current-user", userAuth, (req, res) => {
  try {
    res.status(200).json(req.user);

    // const token = req.cookies.accessToken;
    // if (!token) {
    //   return res.status(401).json({ message: "Not authenticated" });
    // }
    // try {
    //   const jwtSecret = process.env.JWT_SECRET;
    //   const decoded = jwt.verify(token, jwtSecret);
    //   res.status(200).json({ userId: decoded.user.id });
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
});

authRouter.put(
  "/current-user",
  userAuth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { fullName, password, avatar } = req.body;
      const file = req.file;

      const updateData = {};

      // Update fullName if provided
      if (fullName) updateData.fullName = fullName;

      // Update encrypted password if provided
      if (password) updateData.password = hashPassword(password);

      if (avatar) updateData.avatar = avatar;
      // Update avatar if provided
      else if (file) {
        const avatarUrl = await imageUpload(file.path);
        updateData.avatar = avatarUrl;
        // updateData.avatar = `/uploads/${file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

authRouter.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logout successful" });
});

export default authRouter;
