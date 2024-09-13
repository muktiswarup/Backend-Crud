const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Users = require("../Model/Usermodel");

const route = express.Router();

route.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "email is required").isEmail(),
    check("password", "Password must be 6 and more character").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;
    try {
      let user = await Users.findOne({ email });
      if (user) {
        return res.status(400).json({ msz: "user is already exist" });
      }
      user = new Users({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.status(201).json({
        msz: "user created succesfully",
      });
    } catch (error) {
      console.error("error.message");
      res.status(500).send("Server error");
    }
  }
);

route.get("/", async (req, res) => {
  const user = await Users.findOne(req.body);
  res.send({email:user.email,name:user.name});
});

route.get("/:id", async (req, res) => {
  const user = await Users.findById(req.params.id);
  try {
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

route.put(
  "/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await Users.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Update user fields
      user.name = name;
      user.email = email;

      // Hash new password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      res.json({ msg: "User updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

route.delete("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.deleteOne();
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = route;
