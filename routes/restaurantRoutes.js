const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../middleware/verifyJwt");
const auth = require("../middleware/auth");

// Middleware to validate query parameters
const validateQueryParams = [
  check("page").optional().isInt().toInt(),
  check("perPage").optional().isInt().toInt(),
  check("name").optional().isString(), // Assuming "name" for searching restaurants
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.use("/api/restaurants/", (req, res, next) => {
  next();
});

// /api/restaurants
router
  .route("/")
  .get(validateQueryParams, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10;
      const name = req.query.name || null;

      const restaurants = await db.getAllRestaurants(page, perPage, name);
      res.status(200).json(restaurants);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(auth, verifyToken, async (req, res) => {
    try {
      const newRestaurant = await db.addNewRestaurant(req.body);
      res.status(201).json(newRestaurant);
    } catch (err) {
      console.error("Error adding new restaurant:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// /api/restaurants/:restaurantId
router
  .route("/:restaurantId")
  .get(async (req, res) => {
    try {
      const restaurant = await db.getRestaurantById(req.params.restaurantId);
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (err) {
      console.error("Error fetching restaurant by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .put(auth, verifyToken, async (req, res) => {
    try {
      const updatedRestaurant = await db.updateRestaurantById(
        req.body,
        req.params.restaurantId
      );
      if (updatedRestaurant) {
        res.status(200).json(updatedRestaurant);
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (err) {
      console.error("Error updating restaurant by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .delete(auth, verifyToken, async (req, res) => {
    try {
      const deletedRestaurant = await db.deleteRestaurantById(
        req.params.restaurantId
      );
      if (deletedRestaurant) {
        res.status(200).json({ message: "Restaurant deleted successfully" });
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (err) {
      console.error("Error deleting restaurant by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// /api/restaurants/get/sorted
router.route("/get/sorted").get(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const name = req.query.name || null;

    let restaurants, order;

    // Check if sort parameter is provided
    if (req.query.sort) {
      // Use the sort parameter if provided
      const sortField = req.query.sort;
      if (req.query.order) {
        order = req.query.order;
      }
      restaurants = await db.getAllRestaurantsSorted(
        page,
        perPage,
        name,
        sortField,
        order
      );
    } else {
      // Use the default sorting logic
      restaurants = await db.getAllRestaurants(page, perPage, name);
    }

    res.status(200).json(restaurants);
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
