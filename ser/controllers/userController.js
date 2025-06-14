const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const sendResetPasswordEmail = require("../utils/sendResetPasswordMail");

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.createUser(name, email, hashedPassword);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: user,
        token,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: "error",
          error: "User not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "error",
          error: "Invalid password",
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: user,
        token,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: "error",
          error: "Email is required",
        });
      }

      const resetCode = crypto.randomBytes(3).toString("hex").toUpperCase();
      const resetPasswordToken = await bcrypt.hash(resetCode, 10);

      const user = await userModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: "error",
          error: "User not found",
        });
      }

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();
      sendResetPasswordEmail(email, resetCode);

      res.status(200).json({
        status: "success",
        message: "Password reset email sent",
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, resetCode, newPassword } = req.body;

      if (!email || !resetCode || !newPassword) {
        return res.status(400).json({
          status: "error",
          error: "Email, reset code, and new password are required",
        });
      }

      const user = await userModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: "error",
          error: "User not found",
        });
      }

      const isResetCodeValid = await bcrypt.compare(
        resetCode,
        user.resetPasswordToken
      );
      if (!isResetCodeValid) {
        return res.status(400).json({
          status: "error",
          error: "Invalid reset code",
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  },
  getUserCount: async (req, res) => {
    try {
      const userCount = await userModel.find().countDocuments();
      res.json({
        status: "success",
        data: userCount,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  },
  updateSurveyParams: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          error: "User not found",
        });
      }

      if (user.isAssessmentComplete) {
        return res.status(203).json({
          status: "error",
          error: "Assessment already completed",
        });
      }

      console.log(req.body);
      const answers = req.body.answers;

      await userModel.updateOne(
        { _id: userId },
        { $set: { surveyParameters: answers, isAssessmentComplete: true } }
      );

      await user.save();

      res.status(200).json({
        status: "success",
        message: "Survey parameters updated successfully",
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  },
};

module.exports = userController;
