const mongoose = require("mongoose");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

const db = {
  initialize: async (url) => {
    try {
      await mongoose.connect(url);
      console.log("Successfully connected to the database");
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  },

  // Restaurant methods
  addNewRestaurant: (data) => {
    const newRestaurant = new Restaurant(data);
    return newRestaurant.save();
  },

  getAllRestaurants: (page, perPage, name) => {
    const query = name ? { name: { $regex: new RegExp(name, "i") } } : {};
    const skip = (page - 1) * perPage;

    return Restaurant.find(query)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(perPage)
      .exec();
  },

  getRestaurantById: (restaurantId) => {
    return Restaurant.findOne({ restaurantId }).exec();
  },

  updateRestaurantById: (data, restaurantId) => {
    return Restaurant.findOneAndUpdate({ restaurantId }, data, {
      new: true,
    }).exec();
  },

  deleteRestaurantById: (restaurantId) => {
    return Restaurant.findOneAndDelete({ restaurantId }).exec();
  },

  getAllRestaurantsSorted: async (page, perPage, name, sortField, order) => {
    let sortOptions = { [sortField]: 1 }; // 1 for ascending, -1 for descending
    if (order == "desc") {
      sortOptions = { [sortField]: -1 }; // 1 for ascending, -1 for descending
    }
    const query = name ? { name: { $regex: new RegExp(name, "i") } } : {};

    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return restaurants;
  },

  addMenuItemToRestaurant: async (restaurantId, menuItemData) => {
    try {
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        return "Restaurant not found";
      }

      restaurant.menu.push(menuItemData);
      await restaurant.save();
      return restaurant.menu[restaurant.menu.length - 1]; // Return the newly added menu item
    } catch (err) {
      throw err;
    }
  },

  // Get all menu items from a restaurant
  getAllMenuItemsByRestaurantId: async (restaurantId) => {
    try {
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        return "Restaurant not found";
      }

      return restaurant.menu;
    } catch (err) {
      throw err;
    }
  },

  // Get a specific menu item from a restaurant by its ID
  getMenuItemByIdFromRestaurant: async (restaurantId, menuItemId) => {
    try {
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        return "Restaurant not found";
      }

      const menuItem = restaurant.menu.find(
        (item) => item.menuId === parseInt(menuItemId)
      );
      if (!menuItem) {
        return "Menu item not found";
      }

      return menuItem;
    } catch (err) {
      throw err;
    }
  },

  // Update a menu item in a restaurant's menu
  updateMenuItemInRestaurant: async (
    restaurantId,
    menuItemId,
    updatedMenuItemData
  ) => {
    try {
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        return "Restaurant not found";
      }

      const menuItem = restaurant.menu.find(
        (item) => item.menuId === parseInt(menuItemId)
      );
      if (!menuItem) {
        return "Menu item not found";
      }

      menuItem.set(updatedMenuItemData);
      await restaurant.save();
      return menuItem;
    } catch (err) {
      throw err;
    }
  },

  // Delete a menu item from a restaurant's menu
  deleteMenuItemFromRestaurant: async (restaurantId, menuItemId) => {
    try {
      const restaurant = await Restaurant.findOne({ restaurantId });
      console.log(restaurant);
      if (!restaurant) {
        console.log("here");
        return "Restaurant not found";
      }

      // Find the index of the menu item to be removed
      const index = restaurant.menu.findIndex(
        (item) => item.menuId === parseInt(menuItemId)
      );
      if (index === -1) {
        return "Menu item not found";
      }

      // Remove the menu item from the array
      restaurant.menu.splice(index, 1);
      await restaurant.save();
      return "Menu item deleted successfully";
    } catch (err) {
      throw err;
    }
  },

  // Users methods
  addNewUser: (data) => {
    const newUser = new User(data);
    return newUser.save();
  },

  getUserByName: (data) => {
    return User.findOne({ username: data }).exec();
  },

  getAllUsers: () => {
    return User.find();
  },

  approveUser: (data) => {
    return User.findByIdAndUpdate(data.id, data, { new: true }).exec();
  },

  getCartByUsername: async (username) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found");
        return null; // Or throw an error if you prefer
      }

      // Populate cart with menu objects
      await User.populate(user, {
        path: "cart",
        populate: {
          path: "restaurantId",
          model: "Restaurant",
          select: "menu",
        },
      });

      return user.cart.map((item) => {
        const { menuId, restaurantId } = item;
        const menuObject = restaurantId.menu.find(
          (menu) => menu.menuId === menuId
        );
        return menuObject;
      });
    } catch (error) {
      console.error("Error fetching user cart:", error);
      throw error;
    }
  },

  addToCart: async (username, restaurantId, menuId) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $push: { cart: { menuId, restaurantId } } },
        { new: true }
      );
      if (!updatedUser) {
        console.log("User not found");
        return null; // Or throw an error if you prefer
      }
      return updatedUser.cart;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  removeFromCart: async (username, restaurantId, menuId) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $pull: { cart: { restaurantId, menuId } } },
        { new: true }
      );
      if (!updatedUser) {
        console.log("User not found");
        return null; // Or throw an error if you prefer
      }
      return updatedUser.cart;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },
};

module.exports = db;
