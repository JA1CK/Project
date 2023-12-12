const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
router
  .route("/register")
  .post(validateQueryParams, async (req, res) => {
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
        approved: false
      });
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.error("Error adding new user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


// /api/users/login
router
  .route("/login")
  .post(validateQueryParams, async (req, res) => {
    try {
      // Get user input
      const { username, password } = req.body;
  
      // Validate if user exist in our database
      const user = await db.getUserByName(username);
  
      if (user && (await bcrypt.compare(password, user.password))) {

        if(user.approved) {
          
          // Create token
          const token = jwt.sign(
            { user_id: user._id, username },
            tokenKey,
            {
              expiresIn: "2h",
            }
          );
    
          // user
          return res.status(200).json({"token": token});
        }
        return res.status(200).send("Waiting for Approval from Admin.")
      }
      
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  });


// /api/users/admin/view
router
  .route("/admin/view")
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


// /api/users/admin/approve
router
  .route("/admin/approve")
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