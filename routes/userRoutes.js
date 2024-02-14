const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyJwt");

require("dotenv").config();

const tokenKey = process.env.TOKEN_KEY;

// Middleware to validate query parameters
const validateQueryParams = [
  check("username").isString(),
  check("password").isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.use("/api/users/", (req, res, next) => {
  next();
});

// /api/users/register
router.route("/register").post(validateQueryParams, async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await db.getUserByName(username);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await db.addNewUser({
      username,
      password: encryptedPassword,
      admin: false,
      approved: true,
    });

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding new user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// /api/users/login
router.route("/login").post(validateQueryParams, async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate if user exist in our database
    const user = await db.getUserByName(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.approved) {
        // Create token
        const token = jwt.sign({ user_id: user._id, username }, tokenKey, {
          expiresIn: "2h",
        });

        res.cookie("token", token, { httpOnly: true });
        res.cookie("isAdmin", user.admin, { httpOnly: true });
        res.cookie("username", user.username, { httpOnly: true });

        // user
        return res.status(200).json({ token: token });
      }
      return res.status(200).send("Waiting for Approval from Admin.");
    }

    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

// /api/users/logout
router.route("/logout").get((req, res) => {
  res.clearCookie("token");
  res.status(200).json({message: "successfully logout"})
});

// /api/users/viewcart
router.route("/viewcart").get(verifyToken, async (req, res) => {
  try {
    const cart = await db.getCartByUsername(req.cookies.username);
    if (cart) {
      res.status(200).json(cart);
    }
  } catch (error) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// /api/users/add-to-cart
router.route("/add-to-cart").get(verifyToken, async (req, res) => {
  try {
    const username = req.cookies.username;
    const restaurantId = req.body.restaurantId;
    const menuId = req.body.menuId;

    const updatedCart = await db.addToCart(username, restaurantId, menuId);
    if (updatedCart) {
      res.status(200).json(updatedCart);
    } else {
      res.status(200).json({ message: "Cart not updated" });
    }
  } catch (error) {
    console.error("Error updating cart:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// /api/users/remove-from-cart
router.route("/remove-from-cart").post(verifyToken, async (req, res) => {
  try {
    const { restaurantId, menuId } = req.body;
    const username = req.cookies.username;

    const updatedCart = await db.removeFromCart(username, restaurantId, menuId);
    if (updatedCart) {
      res.status(200).json(updatedCart);
    } else {
      res.status(200).json({ message: "Cart not updated" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
