const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { ValidationError } = require("sequelize");
const { User } = require("../models");
const { authenticate } = require("../middleware/auth");

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("name")
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be 20-60 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("address")
      .isLength({ max: 400 })
      .withMessage("Address max 400 characters"),
    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be 8-16 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must include uppercase letter")
      .matches(/[^A-Za-z0-9]/)
      .withMessage("Password must include special character"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      if (!process.env.JWT_SECRET) {
        return res
          .status(500)
          .json({ message: "Server misconfigured: JWT secret is missing." });
      }

      const { name, email, address, password } = req.body;
      const existing = await User.findOne({ where: { email } });
      if (existing)
        return res.status(400).json({ message: "Email already registered" });

      const user = await User.create({
        name,
        email,
        address,
        password,
        role: "user",
      });
      const token = generateToken(user);
      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          errors: err.errors.map((e) => ({ path: e.path, msg: e.message })),
        });
      }
      if (err.name === "SequelizeConnectionError") {
        return res
          .status(503)
          .json({ message: "Database unavailable. Please try again shortly." });
      }
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      if (!process.env.JWT_SECRET) {
        return res
          .status(500)
          .json({ message: "Server misconfigured: JWT secret is missing." });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const valid = await user.comparePassword(password);
      if (!valid)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = generateToken(user);
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
);

// PUT /api/auth/password
router.put(
  "/password",
  authenticate,
  [
    body("currentPassword").notEmpty(),
    body("newPassword")
      .isLength({ min: 8, max: 16 })
      .matches(/[A-Z]/)
      .matches(/[^A-Za-z0-9]/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findByPk(req.user.id);
      const valid = await user.comparePassword(req.body.currentPassword);
      if (!valid)
        return res.status(401).json({ message: "Current password incorrect" });

      user.password = req.body.newPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
);

// GET /api/auth/me
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
