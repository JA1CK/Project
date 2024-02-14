const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  approved: Boolean,
  cart: [
    {
      menuId: { type: Number, required: true },
      restaurantId: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model('ProjectUser', UserSchema);