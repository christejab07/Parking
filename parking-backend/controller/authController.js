const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);
const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/.test(
    password
  );

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!validateUsername(username)) {
      return res.status(400).json({
        error:
          "Username must be 3-20 characters, alphanumeric with underscores",
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Password must be 8-30 characters, with uppercase, lowercase, number, and special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { username, email },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: "Invalid password format" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "User logged in", token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };
