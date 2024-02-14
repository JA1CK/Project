const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  restaurantId: {
    type: Number,
    required: true,
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  cuisine: [{ type: String, required: true }],
  rating: { type: Number, default: 0 },
  menu: [
    {
      menuId: { type: Number, required: true },
      itemName: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);