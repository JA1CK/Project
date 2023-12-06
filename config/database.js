const mongoose = require("mongoose");
const Movie = require("../models/movie");

const db = {
  initialize: async (url) => {
    try {
      await mongoose.connect(url);
      console.log("Successfully connected to the database");
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  },

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
  }
};

module.exports = db;