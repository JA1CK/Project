const mongoose = require("mongoose");
const Movie = require("../models/movie");
const User = require("../models/user");

const db = {
  initialize: async (url) => {
    try {
      await mongoose.connect(url);
      console.log("Successfully connected to the database");
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  },

  // movies methods
  addNewMovie: (data) => {
    const newMovie = new Movie(data);
    return newMovie.save();
  },

  getAllMovies: (page, perPage, title) => {
    const query = title ? { title: title } : {};
    const skip = (page - 1) * perPage;

    return Movie.find(query)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(perPage)
      .exec();
  },

  getMovieById: (id) => {
    return Movie.findById(id).exec();
  },

  updateMovieById: (data, id) => {
    return Movie.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  deleteMovieById: (id) => {
    return Movie.findByIdAndDelete(id).exec();
  },

  getAllMoviesSorted: async (page, perPage, title, sortField, order) => {
    let sortOptions = { [sortField]: 1 }; // 1 for ascending, -1 for descending
    if(order == "desc") {
      sortOptions = { [sortField]: -1 }; // 1 for ascending, -1 for descending
    }
    const query = title ? { title: title } : {};

    const movies = await Movie.find(query)
      .sort(sortOptions)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
  
    return movies;
  },

  // Users methods
  addNewUser: (data) => {
    const newUser = new User(data);
    return newUser.save();
  },
  
  getUserByName: (data) => {
    return User.findOne({ "username":data }).exec();
  },

  getAllUsers: () => {
    return User.find();
  },

  approveUser: (data) => {
    return User.findByIdAndUpdate(data.id, data, { new: true }).exec();
  }
};

module.exports = db;