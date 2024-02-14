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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.use("/api/menus/", (req, res, next) => {
  next();
});

// /api/menus/restaurant/:restaurantId
router
  .route("/restaurant/:restaurantId")
  .get(validateQueryParams, async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const menuItems = await db.getAllMenuItemsByRestaurantId(restaurantId);

      res.status(200).json(menuItems);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(auth, verifyToken, async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const newMenuItem = await db.addMenuItemToRestaurant(
        restaurantId,
        req.body
      );
      res.status(201).json(newMenuItem);
    } catch (err) {
      console.error("Error adding new menu item:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// /api/menus/restaurant/:restaurantId/:menuItemId
router
  .route("/restaurant/:restaurantId/:menuItemId")
  .get(validateQueryParams, async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const menuItemId = req.params.menuItemId;
      const menuItem = await db.getMenuItemByIdFromRestaurant(
        restaurantId,
        menuItemId
      );
      res.status(200).json(menuItem);
    } catch (err) {
      console.error("Error fetching menu item:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .put(auth, verifyToken, async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const menuItemId = req.params.menuItemId;
      const updatedMenuItem = await db.updateMenuItemInRestaurant(
        restaurantId,
        menuItemId,
        req.body
      );
      res.status(200).json(updatedMenuItem);
    } catch (err) {
      console.error("Error updating menu item:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .delete(auth, verifyToken, async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const menuItemId = req.params.menuItemId;
      const result = await db.deleteMenuItemFromRestaurant(
        restaurantId,
        menuItemId
      );
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "Menu item not found" });
      }
    } catch (err) {
      console.error("Error deleting menu item:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
