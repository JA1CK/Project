const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

require("dotenv").config();

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


router.use("/api/admin/", (req, res, next) => {
  next();
});

// /api/admin/view
router
  .route("/view")
  .get(validateQueryParams, async (req, res) => {
    try {
      // Get user input
      const { username, password } = req.body;
  
      // Validate if user exist in our database
      const user = await db.getUserByName(username);
  
      if (user && user.approved && user.admin && (await bcrypt.compare(password, user.password))) {
        const users = await db.getAllUsers();
        return res.status(200).send(users);
      }
      
      return res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  });


// /api/admin/approve
router
  .route("/approve")
  .put(validateQueryParams, async (req, res) => {
    try {
      // Get user input
      const { username, password, uname } = req.body;
  
      // Validate if user exist in our database
      const admin = await db.getUserByName(username);
  
      if (admin && admin.approved && admin.admin && (await bcrypt.compare(password, admin.password))) {
        
        const user = await db.getUserByName(uname);
        user.approved = !user.approved;
        updatedUser = await db.approveUser(user);
        return res.status(200).send(updatedUser);
      }
      
      return res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;