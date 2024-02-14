const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const db = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;
const dbUrl = process.env.DB_URL;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());


// Connect to databases and start the server
db.initialize(dbUrl)
  .then(() => {
    // Set up routes
    app.use("/api/restaurants", restaurantRoutes);
    app.use("/api/menus", menuRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/admin", adminRoutes);
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });