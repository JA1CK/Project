const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  admin: Boolean,
  approved: Boolean
});

module.exports = mongoose.model('ProjectUser', UserSchema);
